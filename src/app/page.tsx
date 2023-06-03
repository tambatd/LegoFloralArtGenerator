/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
"use client";
import { useState } from "react";
import styles from "./page.module.css";
import stud from "./assets/sub.png";
import intro from "./assets/intro.svg";
import { findClosestColor, Color } from "./functions/functions";

const colorArray: Color[] = [
  { r: 245, g: 244, b: 246 },
  { r: 137, g: 199, b: 157 },
  { r: 229, g: 173, b: 35 },
  { r: 216, g: 151, b: 190 },
  { r: 182, g: 70, b: 138 },
  { r: 67, g: 140, b: 139 },
  { r: 45, g: 76, b: 162 },
  { r: 24, g: 42, b: 80 },
];

const RepeatDiv = () => {
  const divCount = 1536; // Number of times to repeat the div
  const renderDivs = () => {
    return Array.from({ length: divCount }).map((_, index) => (
      <div
        className={styles.LegoStud}
        style={{
          background: `url(${stud.src}) center/cover no-repeat`,
        }}
        id={index.toString()}
        key={index}
      />
    ));
  };
  return renderDivs();
};

export default function Home() {
  const [backgroundImage, setBackgroundImage] = useState("");

  const [lines, setLines] = useState(true);

  const onImageUploaded = () => {
    const image = document.getElementById("image");
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const width = image.width;
    const height = image.height;

    canvas.width = width;
    canvas.height = height;

    context.drawImage(image, 0, 0, width, height);

    // Get the image data for the 12x12 pixel area at (0, 0)
    let idValue = 0;
    for (let index = 0; index < height; index += 12) {
      for (let innerIndex = 0; innerIndex < width; innerIndex += 12) {
        const imageData = context.getImageData(innerIndex, index, 12, 12).data;

        let totalRed = 0;
        let totalGreen = 0;
        let totalBlue = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          totalRed += imageData[i];
          totalGreen += imageData[i + 1];
          totalBlue += imageData[i + 2];
        }

        const pixelCount = imageData.length / 4;
        const averageRed = Math.round(totalRed / pixelCount);
        const averageGreen = Math.round(totalGreen / pixelCount);
        const averageBlue = Math.round(totalBlue / pixelCount);

        let chosenColor = { r: averageRed, g: averageGreen, b: averageBlue };
        const closestMatch = findClosestColor(chosenColor, colorArray);

        var divElement = document.getElementById(idValue.toString());
        divElement.style.setProperty(
          "background-color",
          `rgb(${closestMatch.r},${closestMatch.g},${closestMatch.b})`,
          "important"
        );

        idValue += 1;
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const imageUrl = reader.result;
      setBackgroundImage(imageUrl);
      setTimeout(function () {
        onImageUploaded();
      }, 1);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <div className={styles.app}>
        <img
          src={backgroundImage ? `${backgroundImage}` : intro.src}
          id="image"
          alt="uploadDiv"
          className={styles.uploadImage}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
        <div className={lines ? styles.vertical : styles.none}>
          <div
            className={styles.main}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            src={`${backgroundImage}`}
            style={{
              background: `url(${backgroundImage}) center/cover no-repeat`,
            }}
          >
            <RepeatDiv />
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={() => setLines(!lines)} className={styles.button}>
          {lines ? "Disable" : "Enable"} Lines
        </button>
      </div>
    </div>
  );
}
