// @ts-expect-error
const $ = window.$;

export default function createGuillotine({
  image,
  width,
  height,
}: {
  image: HTMLImageElement;
  width: number;
  height: number;
}) {
  const picture = $(image);

  picture.one("load", function () {
    picture.guillotine({ width, height, eventOnChange: "guillotinechange" });
    picture.guillotine("fit");
  });

  if (picture.prop("complete")) {
    picture.trigger("load");
  }

  return {
    getImage: () => image,
    getData: () => {
      const data = picture.guillotine("getData");

      return {
        top: Math.floor(data.y / data.scale),
        left: Math.floor(data.x / data.scale),
        width: Math.floor(width / data.scale),
        height: Math.floor(height / data.scale),
      };
    },
    rotateLeft: () => picture.guillotine("rotateLeft"),
    rotateRight: () => picture.guillotine("rotateRight"),
    center: () => picture.guillotine("center"),
    fit: () => picture.guillotine("fit"),
    zoomIn: () => picture.guillotine("zoomIn"),
    zoomOut: () => picture.guillotine("zoomOut"),
    remove: () => picture.guillotine("remove"),
  };
}

export type Guillotine = ReturnType<typeof createGuillotine>;
