import { DateTime } from "luxon";
import { useCallback, useEffect, useMemo, useState } from "react";
import seedrandom from "seedrandom";
import {
  bigEnoughCountriesWithImage,
  countriesWithImage,
  Country,
  smallCountryLimit,
} from "../domain/countries";
import { Guess, loadAllGuesses, saveGuesses } from "../domain/guess";

const forcedCountries: Record<string, string> = {
  // "2022-02-02": "TD",
};

export function getDayString(shiftDayCount?: number) {
  return DateTime.now()
    .plus({ days: shiftDayCount ?? 0 })
    .toFormat("yyyy-MM-dd");
}

export function useTodays(dayString: string): [
  {
    country?: Country;
    guesses: Guess[];
  },
  (guess: Guess) => void,
  number,
  number
] {
  const [todays, setTodays] = useState<{
    country?: Country;
    guesses: Guess[];
  }>({ guesses: [] });

  const addGuess = useCallback(
    (newGuess: Guess) => {
      if (todays == null) {
        return;
      }

      const newGuesses = [...todays.guesses, newGuess];

      setTodays((prev) => ({ country: prev.country, guesses: newGuesses }));
      saveGuesses(dayString, newGuesses);
    },
    [dayString, todays]
  );

  useEffect(() => {
    const guesses = loadAllGuesses()[dayString] ?? [];
    const country = getCountry(dayString);

    setTodays({ country, guesses });
  }, [dayString]);

  const randomAngle = useMemo(
    () => seedrandom.alea(dayString)() * 360,
    [dayString]
  );

  const imageScale = useMemo(() => {
    const normalizedAngle = 45 - (randomAngle % 90);
    const radianAngle = (normalizedAngle * Math.PI) / 180;
    return 1 / (Math.cos(radianAngle) * Math.sqrt(2));
  }, [randomAngle]);

  return [todays, addGuess, randomAngle, imageScale];
}

function getCountry(dayString: string) {
  const currentDayDate = DateTime.fromFormat(dayString, "yyyy-MM-dd");
  const epochDate = DateTime.fromFormat("2022-03-21", "yyyy-MM-dd");
  const cutoverDate = DateTime.fromFormat("2026-05-15", "yyyy-MM-dd");
  let pickingDate = epochDate;
  let smallCountryCooldown = 0;
  let pickedCountry: Country | null = null;

  do {
    smallCountryCooldown--;

    const pickingDateString = pickingDate.toFormat("yyyy-MM-dd");

    // Before 2026-05-15, the seed was the date string (e.g. "2026-05-14").
    // Consecutive date strings differ only in their last byte, which causes
    // seedrandom.alea to produce correlated outputs — enough to land on the
    // same municipality index two days in a row (confirmed bug: Simrishamn×2,
    // Sigtuna×2 in May 2026). From 2026-05-15 onwards we use the integer day
    // offset from the epoch instead, which eliminates the structural correlation.
    let seed: string;
    if (pickingDate < cutoverDate) {
      seed = pickingDateString;
    } else {
      seed = pickingDate.diff(epochDate, "days").days.toString();
    }

    const forcedCountryCode = forcedCountries[dayString];
    const forcedCountry =
      forcedCountryCode != null
        ? countriesWithImage.find(
            (country) => country.code === forcedCountryCode
          )
        : undefined;

    const countrySelection =
      smallCountryCooldown < 0
        ? countriesWithImage
        : bigEnoughCountriesWithImage;

    pickedCountry =
      forcedCountry ??
      countrySelection[
        Math.floor(seedrandom.alea(seed)() * countrySelection.length)
      ];

    pickingDate = pickingDate.plus({ day: 1 });
  } while (pickingDate <= currentDayDate);

  return pickedCountry;
}
