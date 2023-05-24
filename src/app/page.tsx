/* eslint-disable @next/next/no-img-element */
//@ts-nocheck
"use client";
import { useState } from "react";
import styles from "./page.module.css";
import stud from "./assets/sub.png";
import upload from "./assets/upload.png";
import intro from "./assets/intro.svg";

interface Color {
  r: number;
  g: number;
  b: number;
}

const colorArray: Color[] = [
  { r: 245, g: 244, b: 246 },
  { r: 137, g: 199, b: 157 },
  { r: 229, g: 173, b: 35 },
  { r: 216, g: 151, b: 190 },
  { r: 182, g: 70, b: 138 },
  { r: 67, g: 140, b: 139 },
  { r: 45, g: 76, b: 162 },
  { r: 24, g: 42, b: 80 },
]; // Array of colors to compare against
const RepeatDiv = () => {
  const divCount = 1536; // Number of times to repeat the div
  //48
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

  function rgbToLab(color: Color): number[] {
    let { r, g, b } = color;
    r /= 255;
    g /= 255;
    b /= 255;

    const x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
    const y = 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
    const z = 0.0193339 * r + 0.119192 * g + 0.9503041 * b;

    let fx = x > 0.008856 ? Math.pow(x, 1 / 3) : (903.3 * x + 16) / 116;
    let fy = y > 0.008856 ? Math.pow(y, 1 / 3) : (903.3 * y + 16) / 116;
    let fz = z > 0.008856 ? Math.pow(z, 1 / 3) : (903.3 * z + 16) / 116;

    const l = Math.max(0, 116 * fy - 16);
    const a = 500 * (fx - fy);
    const b1 = 200 * (fy - fz);

    return [l, a, b1];
  }

  function calculateDistance(color1: Color, color2: Color): number {
    const lab1 = rgbToLab(color1);
    const lab2 = rgbToLab(color2);

    const deltaL = lab2[0] - lab1[0];
    const deltaA = lab2[1] - lab1[1];
    const deltaB = lab2[2] - lab1[2];

    const distance = Math.sqrt(deltaL ** 2 + deltaA ** 2 + deltaB ** 2);
    return distance;
  }

  function findClosestColor(
    targetColor: Color,
    colorArray: Color[]
  ): Color | null {
    let closestColor: Color | null = null;
    let minDistance: number = Infinity;

    for (const color of colorArray) {
      const distance = calculateDistance(targetColor, color);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }

    return closestColor;
  }

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

    // Calculate the average color values for each channel (R, G, B)
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
    <div className={styles.app}>
      <img
        src={backgroundImage ? `${backgroundImage}` : intro.src}
        id="image"
        className={styles.uploadImage}
        alt={upload.src}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      />

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
  );
}
