import styles from "./Gallery.module.css";
import PhotoModal from "./PhotoModal";
import BlankAlbum from "./BlankAlbum";
import Album from "./Album";
import ScrollDown from "../common/ScrollDown";
import { useState, useEffect, useRef, useCallback } from "react";

import { useDebouncedCallback } from 'use-debounce';
import { db } from "../Utility/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
} from "firebase/firestore/lite";

const Gallery = ({ takePhoto, onClick }) => {
  //이 Timestamp 이전의 사진들은 모두 로드됨.
  const [curTimeStamp, setCurTimeStamp] = useState(0);
  //더 이상 불러올 데이터가 없는지
  const [endOfData, setEndOfData] = useState(false);
  //데이터 로딩중
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundHeight, setBackgroundHeight] = useState(0);
  // <ScrollDown/> 개수
  const [arrows, setArrows] = useState([<ScrollDown key={0} top_={900} />]);

  const background = useRef(null);
  // useEffect(()=>console.log(backgroundHeight),[backgroundHeight]);
  //새로 데이터가 로딩될때마다 background 높이 업데이트하기
  useEffect(() => {
    if (background.current) {
      setBackgroundHeight(background.current.getBoundingClientRect().height);
    }
  }, [isLoading]);
  //일정 높이에 도달할 때마다 <ScrollDown /> 추가하기
  useEffect(() => {
    if (background.current) {
      const cnt = arrows.length;
      if (280 + (cnt + 1) * 700 < backgroundHeight) {
        const newArr = [...arrows,<ScrollDown key={cnt+1} top_={cnt * 700 + 700} />];
        setArrows(newArr);
      }
    }
  }, [backgroundHeight]);

  const pageEnd = useRef(null);
  //가장 아래에 닿으면 데이터를 10개씩 더 가져온다.

  useEffect(()=>{
      if(pageEnd.current) observer.observe(pageEnd.current);
    },[]);
    
    const onIntersect = async ([entry], observer) => {
        if (entry.isIntersecting) {
            console.log('intersect');
            observer.unobserve(entry.target);
            const response = await getMorePhotos();
            observer.observe(entry.target);
        }
    };
    const observer = new IntersectionObserver(onIntersect, { threshold: 1 });

  const [photos, setPhotos] = useState([
    {
      imageurl: "a",
      vidConfig: 0,
    },
    {
      imageurl: "a",
      vidConfig: 1,
    },
    {
      imageurl: "blank",
      vidConfig: 0,
    },
    {
      imageurl: "a",
      vidConfig: 0,
    },
    {
      imageurl: "blank",
      vidConfig: 1,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "blank",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "blank",
      vidConfig: 0,
    },
    {
      imageurl: "a",
      vidConfig: 1,
    },
    {
      imageurl: "blank",
      vidConfig: 0,
    },
    {
      imageurl: "blank",
      vidConfig: 1,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "blank",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 0,
    },
  ]);

  //   const [photos,setPhotos] = useState([{
  //     imageurl:"a",
  //     vidConfig:0
  // },
  // {
  //   imageurl: "a",
  //   vidConfig: 1,
  // },
  // {
  //     imageurl: 'blank',
  //     vidConfig: 0,
  //   },
  //   {
  //     imageurl: "a",
  //     vidConfig: 0,
  //   },

  //   {
  //     imageurl: "a",
  //     vidConfig: 1,
  //   },

  //   {
  //     imageurl: 'a',
  //     vidConfig: 0,
  //   },
  // ]);

  const getMorePhotos = useCallback(async () => {
    //10개씩 사진 가져오기.
    console.log("getmorePhotos");
    const queryTemp = query(
      collection(db, "Photos"),
      where("id", ">", curTimeStamp),
      limit(10)
    );
    setIsLoading(true);
    const dataSnapShot = await getDocs(queryTemp);
    console.log('사진 불러오기');
    const length = dataSnapShot.length;
    const dataList = dataSnapShot.docs.map((doc) => doc.data());
    if (length) {
      setCurTimeStamp(dataList[length - 1].id); //가져온 마지막 데이터의 TimeStamp를 저장
      setPhotos((prev) => [...prev, ...dataList]);
    } else {
      setEndOfData(true);
    }
    setIsLoading(false);
    setPhotos(dataList);
  },[curTimeStamp,photos]);
const debouncedGetMorePhotos = useDebouncedCallback(
    ()=>console.log('사진 가져오기'),100
);
// const getMorePhotos = () => console.log('사진 가져오기');

  //처음 실행 시 사진 가져오기
  // useEffect(()=>{
  //     console.log('처음 사진 가져오기');
  //     getMorePhotos();
  //     }
  // ,[]);




  return (
    <>
      {takePhoto && <PhotoModal photoList={photos} onClick={onClick} />}
      <div className={styles.background} ref={background}>
        <div className={styles.albumContainer}>
          {photos.map((data, index) => {
            if (data.imageurl === "blank") {
              return <BlankAlbum key={index} />;
            } else {
              return <Album key={index} data={data} />;
            }
          })}
        </div>
        {isLoading && <div className={styles.loadingDiv}> Loading...</div>}
        {arrows}
      </div>
      {!endOfData && <div className={styles.pageEnd} ref={pageEnd}></div>}
    </>
  );
};

export default Gallery;
