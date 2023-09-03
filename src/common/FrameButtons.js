import { React, useEffect, useState } from "react";
//imports

//css
import styles from "./FrameButtons.module.css";
import ThumbImage from "../assets/Images/thumb.png";

const FrameButtons = ({
  isLoading,
  imgfile,
  photoTaken,
  onTakePhoto,
  onSavePhoto,
  onDeletePhoto,
  onToggleModalHandler,
  onFrameSelect,
  onSkinSelect
}) => {
  const [phase,setPhase] = useState(1);
  useEffect(()=>{console.log('phase: '+phase)},[phase]);
  //phase 1: frame select phase 2: skin select phase 3: before photo 4: after photo 
  const againHandler = () => {
    onDeletePhoto();
  };
  const classNameByConfig = phase===1 ? styles.frame
    : phase===2 ? styles.skin
    : phase===3 ? styles.beforePhoto
    : styles.afterPhoto;

  return (
    <div className={`${styles.container} ${classNameByConfig}`}>
      <div className={styles.text}>
        <p className={styles.comit}>COMIT</p>
        <p className={styles.photobooth}>Photo Booth</p>
      </div>

      {phase === 1 && <>
        <button
          className={`${styles.framebtn} ${styles.square}`}
          onClick={() => onFrameSelect(0)}
        />
        <button
          className={`${styles.framebtn} ${styles.vertical}`}
          onClick={() => onFrameSelect(1)}
        />
        <button
          className={`${styles.framebtn} ${styles.horizontal}`}
          onClick={() => onFrameSelect(2)}
        />
        </>
      }
      {/* skin */}
      {phase === 2 && <>
        <button className={`${styles.skinbtn} ${styles.skin1}`}
          onClick={() => onSkinSelect(0)}>A</button>
        <button className={`${styles.skinbtn} ${styles.skin2}`}
          onClick={() => onSkinSelect(1)}>B</button>
        <button className={`${styles.skinbtn} ${styles.skin3}`}
          onClick={() => onSkinSelect(2)}>C</button>
        <button className={`${styles.skinbtn} ${styles.skin4}`}
          onClick={() => onSkinSelect(3)}>D</button>
      </>}

      {/* (phase===3 || (phase===4 && !imgfile)) &&  */}
      {phase===4 && imgfile && 
        <img
          src={ThumbImage}
          alt="ThumbImage"
          style={{
            gridArea: "img",
            justifySelf: "center",
            alignSelf: "center",
          }}
        />}

      {/* Next */}
      {(phase===1 || phase===2) && 
        <button
          className={`${styles.movebtn} ${styles.nextbtn}`}
          onClick={()=>setPhase((prev)=>prev+1)}
        />
      }
    
      {/*Take Photo*/}
      {phase===3 && 
          <button
            className={`${styles.movebtn} ${styles.takePhoto}`}
            onClick={()=>{onTakePhoto(); setPhase(4);}}
          />
      }

      {phase===4 && imgfile &&
        <>
        <button
          className={`${styles.lastbtn} ${styles.again}`}
          onClick={()=>{againHandler(); setPhase(1)}}
        />
        <button
          className={`${styles.lastbtn} ${styles.save}`}
          onClick={onSavePhoto}
        /></>}

      {/* !isLoading &&
        !imgfile && (
          <button
            className={`${styles.movebtn} ${styles.takePhoto}`}
            onClick={onTakePhoto}
          />
        ) */}

      {/* {!isLoading && !imgfile && (
        <button
          className={`${styles.btn} ${styles.photo}`}
          onClick={onTakePhoto}
        >
          {" "}
          Take Picture
        </button>
      )} */}

      <button className={styles.close} onClick={onToggleModalHandler}>
        X
      </button>
    </div>
  );
};

export default FrameButtons;
