import { useEffect, useRef, useState } from "react";
import * as S from "./style";
import { BsTelephoneFill, BsChatText } from "react-icons/bs";
import {
  IoBusOutline,
  IoSubwayOutline,
  IoCarOutline,
  IoBalloonOutline,
  IoCloseOutline,
  IoCopyOutline,
} from "react-icons/io5";
import { TbMailHeart } from "react-icons/tb";
import { RiKakaoTalkFill } from "react-icons/ri";
import { HiOutlineLink } from "react-icons/hi";
import sampleData from "@/mock/JSONData.json";
import guestBook from "@/mock/GuestBook.json";
import galleryImages from "@/mock/GalleryImages.json";
import { FcLike } from "react-icons/fc";
import {
  formatDay,
  getDate,
  getDateWithDots,
  getDayEng,
  getDayWithTime,
  getDday,
  getFullDate,
  getMonth,
  getYear,
  tileClassName,
} from "@/utils/parseDate";
import "react-calendar/dist/Calendar.css";
import Calendar from "react-calendar";
import LocationCard from "@/components/Common/LocationCard";
import { Helmet } from "react-helmet-async";
import SwiperModal from "@/components/Template/SwiperModal";
import Bgm from "@/components/Template/Bgm";
import { applyStyles } from "@/utils/parseInlineStyle";
import { shareKakao } from "@/utils/shareKakao";
import { copyLink } from "@/utils/copyLink";
import YouTube from "react-youtube";
import { Effects } from "@/constants/ContentsData";

window.YTConfig = {
  host: "https://www.youtube.com",
};

const TheSimple = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [currentGuestBookPage, setCurrentGuestBookPage] = useState(1);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isOpenAccountWho, setIsOpenAccountWho] = useState("");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [curSwiperImageIndex, setCurSwiperImageIndex] = useState(0);
  const containerRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const fieldsRef = useRef<{
    name: HTMLInputElement | null;
    password: HTMLInputElement | null;
    content: HTMLTextAreaElement | null;
    delete: HTMLInputElement | null;
  }>({
    name: null,
    password: null,
    content: null,
    delete: null,
  });

  const itemsPerPage = 5;
  const indexOfLastItem = currentGuestBookPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = guestBook.guestbook.slice(indexOfFirstItem, indexOfLastItem);

  const addItemRef = (el: HTMLDivElement) => {
    if (el && !itemRefs.current.includes(el)) {
      itemRefs.current.push(el);
    }
  };

  const handleClickContantModal = () => {
    setIsContactModalOpen(true);
  };

  const handleCloseModal = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    if (element.classList.contains("container")) {
      setIsContactModalOpen(false);
      setIsAccountModalOpen(false);
      setIsWriteModalOpen(false);
    }
  };

  const handleClickRoadMap = (e: React.MouseEvent<HTMLDivElement>) => {
    let target = e.target as HTMLElement;
    while (target !== null && target.id === "") {
      target = target.parentNode as HTMLElement;
    }
    console.log(target);
    let url = "";
    switch (target.id) {
      case "naver":
        url = `https://map.naver.com/v5/search/${encodeURIComponent(sampleData.location.address)}`;
        break;
      case "kakao":
        url = `https://map.kakao.com/?q=${encodeURIComponent(sampleData.location.address)}`;
        break;
      case "tmap":
        url = `https://apis.openapi.sk.com/tmap/app/routes?appKey=${import.meta.env.VITE_TMAP_APP_KEY}&name=${sampleData.location.address}&lon=${sampleData.location.longitude}&lat=${sampleData.location.latitude}`;
        break;
      default:
        return;
    }
    window.open(url, "_blank");
  };

  const handleClickGuestBookPagination = (index: number) => {
    setCurrentGuestBookPage(index);
  };

  const handleClickCopyAccount = (account: string) => {
    navigator.clipboard
      .writeText(account)
      .then(() => {
        alert("계좌 번호가 클립보드에 복사되었습니다.");
      })
      .catch(err => {
        console.error("클립보드 복사에 실패했습니다.", err);
      });
  };

  const handleClickOpenAccount = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsOpenAccountWho(e.currentTarget.id);
    setIsAccountModalOpen(true);
  };

  const handleClickShareKakao = () => {
    shareKakao({
      title: sampleData.open_graph.title,
      description: sampleData.open_graph.subtitle,
      imageUrl: "https://avatars.githubusercontent.com/u/75530371?v=4",
      link: window.location.href,
    });
  };

  const handleClickOpenWrite = () => {
    setIsWriteModalOpen(true);
  };

  const handleClickWriteComplete = () => {
    const { name, password, content } = fieldsRef.current;

    if (!name?.value || !password?.value || !content?.value) {
      alert("내용을 채워주세요.");
      return;
    } else {
      console.log(name.value);
      console.log(password.value);
      console.log(content.value);
    }
  };

  const handleClickDelete = () => {
    if (fieldsRef.current.delete) {
      if (!fieldsRef.current.delete.value) {
        alert("비밀번호를 입력해주세요.");
        return;
      } else {
        console.log(fieldsRef.current.delete.value);
      }
    }
  };

  const handleClickGalleryImage = (index: number) => {
    setCurSwiperImageIndex(index);
  };

  const handleClickLiveWedding = () => {
    window.open(sampleData.contents.live_url);
  };

  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY);
    }
  }, []);

  useEffect(() => {
    if (itemRefs.current.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px", threshold: 0.2 },
    );

    itemRefs.current.forEach(el => {
      observer.observe(el);
    });

    return () => {
      itemRefs.current.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [itemRefs.current.length]);

  return (
    <S.Container ref={containerRef}>
      <Helmet>
        <title>{sampleData.open_graph.title}</title>
        <meta name="description" content={`${sampleData.open_graph.title} 결혼합니다`} />
        <meta property="og:title" content={sampleData.open_graph.title} />
        <meta property="og:description" content={`${sampleData.open_graph.title} 결혼합니다`} />
        <meta
          property="og:image"
          content="https://images.velog.io/images/anjoy/post/7886527b-8b11-4ccc-a90f-012aeb196297/image.png"
        />
        <meta property="og:url" content="페이지 URL" />
      </Helmet>
      <Bgm audioNumber={sampleData.contents.bgm} />
      <S.MainWrapper ref={addItemRef} className="observer">
        <div className="date">
          <div className="date-yymmdd">
            <span>{getYear(new Date(sampleData.date))}</span>
            <span>{getMonth(new Date(sampleData.date))}</span>
            <span>{getDate(new Date(sampleData.date))}</span>
          </div>
          <div className="date-day">
            <span>{getDayEng(new Date(sampleData.date))}</span>
          </div>
        </div>
        <div className="main-image">
          <img src="/img1.jpg" />
          <div className="background-video">
            <video muted autoPlay loop playsInline>
              <source src={Effects[sampleData.contents.effect - 1]} type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="wedding-info">
          <div className="wedding-info-name">
            <span>{sampleData.HUSBAND.ME.name}</span>
            <div id="divider"></div>
            <span>{sampleData.WIFE.ME.name}</span>
          </div>
          <div className="wedding-info-date">
            <span>{getFullDate(new Date(sampleData.date))}</span>
          </div>
          <div className="wedding-info-hall">
            <span>{sampleData.location.wedding_hall}</span>
          </div>
        </div>
      </S.MainWrapper>
      <S.GreetingWrapper ref={addItemRef} className="observer">
        <img src="/Template/icon_flower.png" />
        <div className="text">
          {sampleData.welcome.map(({ text, inline_style }, index) => (
            <p key={index}>{applyStyles(text, inline_style)}</p>
          ))}
        </div>
      </S.GreetingWrapper>
      <S.HumanWrapper ref={addItemRef} className="observer">
        <div className="humanInfo">
          <p>
            김장인
            <span className="dot">·</span>
            박장모
            <span className="relation">의 장남</span>
            김신랑
          </p>
        </div>
        <div className="humanInfo">
          <p>
            이사돈
            <span className="dot">·</span>
            김사촌
            <span className="relation">의 차녀</span>
            이신부
          </p>
        </div>
        <button className="contact-button" onClick={handleClickContantModal}>
          <BsTelephoneFill color="cec3c3" />
          연락하기
        </button>
      </S.HumanWrapper>
      <S.CalendarWrapper ref={addItemRef} className="observer">
        <div className="date">
          <p className="yymmdd">{getDateWithDots(new Date(sampleData.date))}</p>
          <p className="ddhhmm">{getDayWithTime(new Date(sampleData.date))}</p>
        </div>
        <div className="calendar">
          <Calendar
            value={new Date(sampleData.date)}
            formatDay={formatDay}
            calendarType="gregory"
            tileClassName={tileClassName}
          />
        </div>
        <div className="d-day">
          <p>
            {sampleData.HUSBAND.ME.name} <FcLike /> {sampleData.WIFE.ME.name}의 결혼식이{" "}
            {getDday(new Date(sampleData.date)) === 0 ? (
              <>
                <span>오늘</span>입니다.
              </>
            ) : (
              <>
                <span>{getDday(new Date(sampleData.date))}일</span> 남았습니다.
              </>
            )}
          </p>
        </div>
      </S.CalendarWrapper>
      <S.LocationContainer ref={addItemRef} className="observer">
        <div className="title">
          <span className="eng">LOCATION</span>
          <span className="kor">오시는 길</span>
        </div>
        <div className="subtitle">
          <p className="wedding-hall">{sampleData.location.wedding_hall}</p>
          <p className="address">{sampleData.location.address}</p>
        </div>
        <div className="roadmap">
          {<LocationCard latitude={sampleData.location.latitude} longitude={sampleData.location.longitude} />}
          <div className="roadmap-nav" onClick={handleClickRoadMap}>
            <div id="naver">
              <img src="/Template/icon_navermap.png" />
              <span>네이버 지도</span>
            </div>
            <div id="kakao">
              <img src="/Template/icon_kakaonavi.png" />
              <span>카카오 내비</span>
            </div>
            <div id="tmap">
              <img src="/Template/icon_tmap.png" />
              <span>티맵</span>
            </div>
          </div>
        </div>
      </S.LocationContainer>
      <S.WayToComeContainer>
        <div ref={addItemRef} className="traffic bus observer">
          <div className="title">
            <div className="icon">
              <IoBusOutline size={30} color="#ab9da1" />
            </div>
            <span>버스로 오시는길</span>
          </div>
          <div className="description">
            {sampleData.road.bus.map(({ text, inline_style }, index) => (
              <p key={index}>{applyStyles(text, inline_style)}</p>
            ))}
          </div>
        </div>
        <div ref={addItemRef} className="traffic subway observer">
          <div className="title">
            <div className="icon">
              <IoSubwayOutline size={30} color="#ab9da1" />
            </div>
            <span>지하철로 오시는길</span>
          </div>
          <div className="description">
            {sampleData.road.subway.map(({ text, inline_style }, index) => (
              <p key={index}>{applyStyles(text, inline_style)}</p>
            ))}
          </div>
        </div>
        <div ref={addItemRef} className="traffic car observer">
          <div className="title">
            <div className="icon">
              <IoCarOutline size={30} color="#ab9da1" />
            </div>
            <span>자가용으로 오시는길</span>
          </div>
          <div className="description">
            {sampleData.road.car.map(({ text, inline_style }, index) => (
              <p key={index}>{applyStyles(text, inline_style)}</p>
            ))}
          </div>
        </div>
        <div ref={addItemRef} className="traffic etc observer">
          <div className="title">
            <div className="icon">
              <IoBalloonOutline size={30} color="#ab9da1" />
            </div>
            <span>{sampleData.road.etc.transport_type}</span>
          </div>
          <div className="description">
            {sampleData.road.etc.info.map(({ text, inline_style }, index) => (
              <p key={index}>{applyStyles(text, inline_style)}</p>
            ))}
          </div>
        </div>
      </S.WayToComeContainer>
      <S.GalleryContainer ref={addItemRef} className="observer">
        <div className="title">
          <span className="eng">GALLERY</span>
          <span className="kor">갤러리</span>
        </div>
        <div className="grid">
          {galleryImages.GalleryImages.map((src, index) => (
            <img key={index} src={src} onClick={() => handleClickGalleryImage(index + 1)} />
          ))}
        </div>
      </S.GalleryContainer>
      {sampleData.contents.video_id && (
        <S.WeddingVideoContainer ref={addItemRef} className="observer">
          <div className="title">
            <span className="eng">WEDDING VIDEO</span>
            <span className="kor">웨딩 영상</span>
          </div>
          <YouTube
            videoId={sampleData.contents.video_id}
            className="youtube"
            opts={{
              width: "100%",
              height: "300px",
              playerVars: {
                autoplay: false,
              },
            }}
          />
        </S.WeddingVideoContainer>
      )}
      {sampleData.contents.live_url && (
        <S.LiveWeddingContainer ref={addItemRef} className="observer">
          <div className="title">
            <span className="eng">LIVE WEDDING</span>
            <span className="kor">라이브 웨딩</span>
          </div>
          <div className="inner">
            <div>
              <span>참석이 어려운 분들께서는</span>
              <br />
              <span> 온라인 중계로 시청하실 수 있습니다.</span>
            </div>
            <button className="view-button" onClick={handleClickLiveWedding}>
              라이브 웨딩 보러가기
            </button>
          </div>
        </S.LiveWeddingContainer>
      )}
      <S.AccountContainer ref={addItemRef} className="observer">
        <img src="/Template/icon_flower_account.png" />
        <h2 className="title">마음 전하실 곳</h2>
        <div className="wrapper">
          <div className="title">
            <h3>신랑측 계좌번호</h3>
            <div className="open-button" id="husband" onClick={handleClickOpenAccount}>
              <TbMailHeart color="#ab9da1" />
              <span>보기</span>
            </div>
          </div>
        </div>
        <div className="wrapper">
          <div className="title">
            <h3>신부측 계좌번호</h3>
            <div className="open-button" id="wife" onClick={handleClickOpenAccount}>
              <TbMailHeart color="#ab9da1" />
              <span>보기</span>
            </div>
          </div>
        </div>
      </S.AccountContainer>
      <S.GuestBookContainer ref={addItemRef} className="observer">
        <div className="title">
          <span className="eng">GUESTBOOK</span>
          <span className="kor">방명록</span>
        </div>
        <div className="guestbook-container">
          {currentItems.map(item => (
            <div key={item.id} className="guestbook-wrapper">
              <h2>{item.name}</h2>
              <p>{item.content}</p>
              <div className="close">
                <span>{getDateWithDots(new Date(item.date))}</span>
                <IoCloseOutline color="#aaa" size={15} onClick={() => setIsDeleteModalOpen(true)} />
              </div>
            </div>
          ))}
        </div>
        <div className="tools">
          <div className="pagination">
            {new Array(Math.floor(guestBook.guestbook.length / 5) + 1).fill(0).map((_, index) => (
              <S.GuestBookPaginationSpan
                $isActiveIndex={currentGuestBookPage === index + 1}
                key={index}
                onClick={() => handleClickGuestBookPagination(index + 1)}
                id={index.toString()}
              >
                {index + 1}
              </S.GuestBookPaginationSpan>
            ))}
          </div>
          <button className="write-button" onClick={handleClickOpenWrite}>
            작성하기
          </button>
        </div>
      </S.GuestBookContainer>
      <S.FooterContainer ref={addItemRef} className="observer">
        <div className="wrapper" onClick={handleClickShareKakao}>
          <RiKakaoTalkFill size={24} />
          <span>카카오톡 공유하기</span>
        </div>
        <div className="wrapper" onClick={() => copyLink(window.location.href)}>
          <HiOutlineLink size={24} />
          <span>링크주소 복사하기</span>
        </div>
        <p>
          Copyright {new Date().getFullYear()}.<span>WECA&nbsp;</span>All rights reserved
        </p>
      </S.FooterContainer>
      {isContactModalOpen && (
        <S.ContactModalContainer onClick={handleCloseModal} className="container">
          <div className="wrapper">
            <div className="title">
              <span className="eng">CONTACT</span>
              <span className="kor">연락하기</span>
            </div>
            <div className="info">
              <div className="human husband">
                <div className="grid">
                  <span className="who">신랑</span>
                  <span>{sampleData.HUSBAND.ME.name}</span>
                  <div className="icons">
                    <a href={`tel:${sampleData.HUSBAND.ME.contact}`}>
                      <BsTelephoneFill color="#8194d8" size={14} />
                    </a>
                    <a href={`sms:${sampleData.HUSBAND.ME.contact}`}>
                      <BsChatText color="#8194d8" size={14} />
                    </a>
                  </div>
                </div>
                {sampleData.HUSBAND.FATHER.contact && (
                  <div className="grid">
                    <span className="who">신랑 아버지</span>
                    <span>{sampleData.HUSBAND.FATHER.name}</span>
                    <div className="icons">
                      <a href={`tel:${sampleData.HUSBAND.FATHER.contact}`}>
                        <BsTelephoneFill color="#8194d8" size={14} />
                      </a>
                      <a href={`sms:${sampleData.HUSBAND.FATHER.contact}`}>
                        <BsChatText color="#8194d8" size={14} />
                      </a>
                    </div>
                  </div>
                )}
                {sampleData.HUSBAND.MOTHER.contact && (
                  <div className="grid">
                    <span className="who">신랑 어머니</span>
                    <span>{sampleData.HUSBAND.MOTHER.name}</span>
                    <div className="icons">
                      <a href={`tel:${sampleData.HUSBAND.MOTHER.contact}`}>
                        <BsTelephoneFill color="#8194d8" size={14} />
                      </a>
                      <a href={`sms:${sampleData.HUSBAND.MOTHER.contact}`}>
                        <BsChatText color="#8194d8" size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="human wife">
                <div className="grid">
                  <span className="who">신부</span>
                  <span>{sampleData.WIFE.ME.name}</span>
                  <div className="icons">
                    <a href={`tel:${sampleData.HUSBAND.ME.contact}`}>
                      <BsTelephoneFill color="#ce7373" size={14} />
                    </a>
                    <a href={`sms:${sampleData.HUSBAND.ME.contact}`}>
                      <BsChatText color="#ce7373" size={14} />
                    </a>
                  </div>
                </div>
                {sampleData.WIFE.FATHER.contact && (
                  <div className="grid">
                    <span className="who">신부 아버지</span>
                    <span>{sampleData.HUSBAND.FATHER.name}</span>
                    <div className="icons">
                      <a href={`tel:${sampleData.HUSBAND.FATHER.contact}`}>
                        <BsTelephoneFill color="#ce7373" size={14} />
                      </a>
                      <a href={`sms:${sampleData.HUSBAND.FATHER.contact}`}>
                        <BsChatText color="#ce7373" size={14} />
                      </a>
                    </div>
                  </div>
                )}
                {sampleData.WIFE.MOTHER.contact && (
                  <div className="grid">
                    <span className="who">신부 어머니</span>
                    <span>{sampleData.HUSBAND.MOTHER.name}</span>
                    <div className="icons">
                      <a href={`tel:${sampleData.HUSBAND.MOTHER.contact}`}>
                        <BsTelephoneFill color="#ce7373" size={14} />
                      </a>
                      <a href={`sms:${sampleData.HUSBAND.MOTHER.contact}`}>
                        <BsChatText color="#ce7373" size={14} />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </S.ContactModalContainer>
      )}
      {isAccountModalOpen && (
        <S.AccountModalContainer onClick={handleCloseModal} className="container">
          {isOpenAccountWho === "husband" ? (
            <div className="wrapper">
              <div className="title">
                <h2>신랑측 계좌번호</h2>
              </div>
              {sampleData.HUSBAND.FATHER.account && (
                <div className="inner">
                  <div className="bank-account">
                    <span className="bank">{sampleData.HUSBAND.FATHER.bank}</span>
                    <span>{sampleData.HUSBAND.FATHER.account}</span>
                  </div>
                  <div className="name">(부) {sampleData.HUSBAND.FATHER.name}</div>
                  <button
                    className="copy-button"
                    onClick={() => handleClickCopyAccount(sampleData.HUSBAND.FATHER.account)}
                  >
                    <IoCopyOutline size={12} />
                    복사
                  </button>
                </div>
              )}
              {sampleData.HUSBAND.MOTHER.account && (
                <div className="inner">
                  <div className="bank-account">
                    <span className="bank">{sampleData.HUSBAND.MOTHER.bank}</span>
                    <span>{sampleData.HUSBAND.MOTHER.account}</span>
                  </div>
                  <div className="name">(모) {sampleData.HUSBAND.MOTHER.name}</div>
                  <button
                    className="copy-button"
                    onClick={() => handleClickCopyAccount(sampleData.HUSBAND.MOTHER.account)}
                  >
                    <IoCopyOutline size={12} />
                    복사
                  </button>
                </div>
              )}
              {sampleData.HUSBAND.ME.account && (
                <div className="inner">
                  <div className="bank-account">
                    <span className="bank">{sampleData.HUSBAND.ME.bank}</span>
                    <span>{sampleData.HUSBAND.ME.account}</span>
                  </div>
                  <div className="name">{sampleData.HUSBAND.ME.name}</div>
                  <button className="copy-button" onClick={() => handleClickCopyAccount(sampleData.HUSBAND.ME.account)}>
                    <IoCopyOutline size={12} />
                    복사
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="wrapper">
              <div className="title">
                <h2>신부측 계좌번호</h2>
              </div>
              {sampleData.WIFE.FATHER.account && (
                <div className="inner">
                  <div className="bank-account">
                    <span className="bank">{sampleData.WIFE.FATHER.bank}</span>
                    <span>{sampleData.WIFE.FATHER.account}</span>
                  </div>
                  <div className="name">(부) {sampleData.WIFE.FATHER.name}</div>
                  <button
                    className="copy-button"
                    onClick={() => handleClickCopyAccount(sampleData.WIFE.FATHER.account)}
                  >
                    <IoCopyOutline size={12} />
                    복사
                  </button>
                </div>
              )}
              {sampleData.WIFE.MOTHER.account && (
                <div className="inner">
                  <div className="bank-account">
                    <span className="bank">{sampleData.WIFE.MOTHER.bank}</span>
                    <span>{sampleData.WIFE.MOTHER.account}</span>
                  </div>
                  <div className="name">(모) {sampleData.WIFE.MOTHER.name}</div>
                  <button
                    className="copy-button"
                    onClick={() => handleClickCopyAccount(sampleData.WIFE.MOTHER.account)}
                  >
                    <IoCopyOutline size={12} />
                    복사
                  </button>
                </div>
              )}
              {sampleData.WIFE.ME.account && (
                <div className="inner">
                  <div className="bank-account">
                    <span className="bank">{sampleData.WIFE.ME.bank}</span>
                    <span>{sampleData.WIFE.ME.account}</span>
                  </div>
                  <div className="name">{sampleData.WIFE.ME.name}</div>
                  <button className="copy-button" onClick={() => handleClickCopyAccount(sampleData.WIFE.ME.account)}>
                    <IoCopyOutline size={12} />
                    복사
                  </button>
                </div>
              )}
            </div>
          )}
        </S.AccountModalContainer>
      )}
      {isWriteModalOpen && (
        <S.WriteModalContainer>
          <div className="wrapper">
            <div className="title">
              <span>방명록</span>
              <button onClick={() => setIsWriteModalOpen(false)}>
                <IoCloseOutline size={25} />
              </button>
            </div>
            <div className="inner">
              <div className="name">
                <span>이름</span>
                <input ref={el => (fieldsRef.current.name = el)} />
              </div>
              <div className="password">
                <span>비밀번호</span>
                <input ref={el => (fieldsRef.current.password = el)} />
              </div>
              <div className="content">
                <textarea placeholder="100자 이내로 작성해주세요" ref={el => (fieldsRef.current.content = el)} />
              </div>
            </div>
            <button className="write-button" onClick={handleClickWriteComplete}>
              작성하기
            </button>
          </div>
        </S.WriteModalContainer>
      )}
      {isDeleteModalOpen && (
        <S.DeleteModalContainer>
          <div className="wrapper">
            <div className="title">
              <span>방명록 삭제</span>
              <button onClick={() => setIsDeleteModalOpen(false)}>
                <IoCloseOutline size={25} />
              </button>
            </div>
            <div className="inner">
              <div className="password">
                <span>비밀번호</span>
                <input ref={el => (fieldsRef.current.delete = el)} />
              </div>
            </div>
            <button className="delete-button" onClick={handleClickDelete}>
              삭제하기
            </button>
          </div>
        </S.DeleteModalContainer>
      )}
      {curSwiperImageIndex ? (
        <SwiperModal
          images={galleryImages.GalleryImages}
          curSwiperImageIndex={curSwiperImageIndex}
          setCurSwiperImageIndex={setCurSwiperImageIndex}
        />
      ) : null}
    </S.Container>
  );
};

export default TheSimple;
