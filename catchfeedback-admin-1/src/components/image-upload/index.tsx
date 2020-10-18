import React, { useState } from "react";
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
  backgroundSize?: string;
};

export default ({
  label,
  image,
  imagePath,
  imageName,
  onComplete,
  backgroundSize = "cover",
}: Props) => {
  const [progress, setProgress] = useState(0);

  const handleImageUpload = (event: any) => {
    const media = event.target.files[0];
    const newImage = new File([media], imageName);
    const imageFullPath = `${imagePath}/${imageName}`;
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

  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div
        className={classNames(styles.imagePreview, {
          [styles.hasImage]: !!image,
        })}
        style={
          image ? { backgroundImage: `url(${image})`, backgroundSize } : {}
        }
      >
        <label className={styles.fileUploadLabel}>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        {!image ? "Click to upload" : ""}
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
