import { useRef } from "react";
import createGuillotine, { Guillotine } from "./utils/guillotine";
import cropAndPadImage from "./utils/cropAndPadImage";
import shareBlob from "./utils/shareBlob";
import downloadBlob from "./utils/downloadBlob";
import version from "./version.json";
import { IconButton } from "./IconButton";

const aspectRatio = 400 / 555;
const canvasWidth = Math.min(400, window.innerWidth * 0.8);
const canvasHeigth = canvasWidth / aspectRatio;

const config = {
  width: canvasWidth,
  height: canvasHeigth,
  minFinalWidth: 1400,
  maxFinalWidth: 1800,
  paddingTop: 0.08,
  paddingHorizontal: 0.08,
  paddingBottom: 0.28,
};

const canvasStyle = {
  width: config.width,
  height: config.height,
};

const frameStyle = {
  width: config.width,
  height: config.height,
  paddingTop: config.width * config.paddingTop,
  paddingLeft: config.width * config.paddingHorizontal,
  paddingRight: config.width * config.paddingHorizontal,
  paddingBottom: config.width * config.paddingBottom,
};

export default function App() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const guillotineRef = useRef<Guillotine>();

  if (guillotineRef.current) {
    guillotineRef.current.remove();
  }

  const selectImage = async () => {
    const wrapper = wrapperRef.current;

    if (!wrapper) {
      return;
    }

    const image = await new Promise<HTMLImageElement>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.click();

      input.onchange = () => {
        const file = input.files![0];
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          const image = new Image();

          image.dataset.originalName = file.name;
          image.src = reader.result as string;
          image.onload = () => resolve(image);
        };
      };
    });

    wrapper.innerHTML = "";
    wrapper.appendChild(image);

    guillotineRef.current = createGuillotine({
      image,
      width: canvasStyle.width,
      height: canvasStyle.height,
    });
  };

  const callGuillotine = (methodName: keyof Guillotine) => {
    return () => {
      const method = guillotineRef.current?.[methodName];

      if (method && typeof method === "function") {
        method();
      }
    };
  };

  const exportImage = (type: "download" | "share") => () => {
    const guillotine = guillotineRef.current;

    if (!guillotine) {
      return;
    }

    const data = guillotine.getData();
    const image = guillotine.getImage();

    const originalName = image.dataset.originalName!.substring(
      0,
      image.dataset.originalName!.lastIndexOf(".")
    );

    cropAndPadImage(
      image,
      data,
      {
        top: data.width * config.paddingTop,
        left: data.width * config.paddingHorizontal,
        right: data.width * config.paddingHorizontal,
        bottom: data.width * config.paddingBottom,
      },
      {
        minWidth: config.minFinalWidth,
        maxWidth: config.maxFinalWidth,
      }
    ).then((blob) =>
      (type === "share" ? shareBlob : downloadBlob)(
        blob,
        `${originalName}-framed.jpg`
      )
    );
  };

  return (
    <>
      <div className="frame" style={frameStyle}>
        <div ref={wrapperRef} style={canvasStyle}>
          <div className="placeholder" />
        </div>
      </div>
      <div className="buttons">
        <IconButton icon="image-outline" onClick={selectImage} />
        <IconButton
          icon="fit-to-page-outline"
          onClick={callGuillotine("fit")}
        />
        <IconButton
          icon="minus-box-outline"
          onClick={callGuillotine("zoomOut")}
        />
        <IconButton
          icon="plus-box-outline"
          onClick={callGuillotine("zoomIn")}
        />
        <IconButton icon="tray-arrow-down" onClick={exportImage("download")} />
        {/* @ts-ignore */}
        {navigator.share && (
          <IconButton
            icon="share-variant-outline"
            onClick={exportImage("share")}
          />
        )}
      </div>
      <div className="version">{version}</div>
    </>
  );
}
