import { Guesses } from "../Guesses";
import { Panel } from "./Panel";
import React from "react";
import { Worldle } from "../Worldle";
import { formatDistance } from "../../domain/geography";
import { SettingsData } from "../../hooks/useSettings";
import { Twemoji } from "react-emoji-render";

interface InfosProps {
  isOpen: boolean;
  close: () => void;
  settingsData: SettingsData;
}

export function Infos({ isOpen, close, settingsData }: InfosProps) {
  return (
    <Panel title="How to play" isOpen={isOpen} close={close}>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div>
          Guess the <Worldle /> in 6 guesses.
        </div>
        <div>Each guess must be a valid municipality.</div>
        <div>
          After each guess, you will have the distance, the direction and the
          proximity from your guess and the target municipality.
        </div>
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <div className="font-bold">Examples</div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Laholm",
                direction: "N",
                distance: 698_000,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your guess <span className="uppercase font-bold">Laholm</span> is{" "}
            {formatDistance(698000, settingsData.distanceUnit)} away from the
            target, the target is to the North, and you only have a 53%
            proximity because it&apos;s quite far away!
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Gävle",
                direction: "N",
                distance: 193_000,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Your second guess <span className="uppercase font-bold">Gävle</span>{" "}
            is &nbsp;
            {formatDistance(193000, settingsData.distanceUnit)} away, to the
            North and 87%!
          </div>
        </div>
        <div>
          <Guesses
            rowCount={1}
            guesses={[
              {
                name: "Sundsvall",
                direction: "N",
                distance: 0,
              },
            ]}
            settingsData={settingsData}
          />
          <div className="my-2">
            Next guess, <span className="uppercase font-bold">Sundsvall</span>,
            is the correct municipality! Congrats!{" "}
            <Twemoji text="🎉" options={{ className: "inline-block" }} />
          </div>
        </div>
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3 font-bold">
        A new <Worldle /> will be available every day!
      </div>
      <div className="space-y-3 text-justify border-b-2 border-gray-200 pb-3 mb-3">
        <Worldle /> has been <span className="font-bold">heavily</span> inspired
        by{" "}
        <a
          className="underline"
          href="https://worldle.teuteuf.fr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Worldle
        </a>{" "}
        created by{" "}
        <a
          className="underline"
          href="https://twitter.com/teuteuf"
          target="_blank"
          rel="noopener noreferrer"
        >
          @teuteuf
        </a>
        .
      </div>
      <div className="space-y-3 text-justify pb-3">
        <div>
          &quot;Made&quot; by{" "}
          <a
            className="underline"
            href="https://github.com/aommm"
            target="_blank"
            rel="noopener noreferrer"
          >
            @aommm
          </a>{" "}
          - (
          <a
            className="underline"
            href="https://github.com/aommm/kommunle"
            target="_blank"
            rel="noopener noreferrer"
          >
            source code
          </a>
          )
        </div>
      </div>
    </Panel>
  );
}
