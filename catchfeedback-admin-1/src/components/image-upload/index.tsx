import React, { useState, useMemo } from "react";
import { LinearProgress } from "@material-ui/core";
import classNames from "classnames";

import { firebaseStorage } from "helpers/firebase";

import styles from "./styles.module.scss";

type Props = {
  label?: string;
  image?: string;
  imagePath: string;
  imageName: string;
  onComplete: (url: string) => void;
  width?: number;
  height?: number;
  backgroundSize?: string;
  className?: string;
};

export default ({
  label,
  image,
  imagePath,
  imageName,
  onComplete,
  width,
  height,
  backgroundSize = "cover",
  className,
}: Props) => {
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (event: any) => {
    const imageFile = event.target.files[0];
    console.log(">>>>", { imageFile });
    const fileName = imageFile.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1);
    console.log(">>>> fileExtension", fileExtension);

    const newImage = new File([imageFile], imageName);
    const imageFullPath = `${imagePath}/${imageName}.${fileExtension}`;
    const uploadTask = firebaseStorage.ref().child(imageFullPath).put(newImage);

    uploadTask.on(
      "state_changed",
      ({ bytesTransferred, totalBytes }) => {
        setProgress((bytesTransferred / totalBytes) * 100);
      },
      console.error,
      async () => {
        const url = await firebaseStorage
          .ref()
          .child(imageFullPath)
          .getDownloadURL();

        onComplete(url);
      }
    );
  };

  const imagePreviewStyle = useMemo(() => {
    const baseStyle = {
      width,
      height,
      backgroundSize,
    };

    return image
      ? {
          ...baseStyle,
          backgroundImage: `url(${image})`,
        }
      : baseStyle;
  }, [backgroundSize, height, image, width]);

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.label}>{label}</div>
      <div
        className={classNames(styles.imagePreviewWparrer, {
          [styles.hasImage]: !!image,
        })}
        style={imagePreviewStyle}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <label className={styles.fileUploadLabel}>
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleImageUpload}
          />
        </label>
        {!image ? (
          <span className={styles.placeholderText}>Click to upload</span>
        ) : null}
      </div>

      <LinearProgress
        className={classNames(styles.uploadProgress, {
          [styles.uploadProgressHidden]: progress === 0 || progress === 100,
        })}
        variant="determinate"
        value={progress}
      />
    </div>
  );
};
