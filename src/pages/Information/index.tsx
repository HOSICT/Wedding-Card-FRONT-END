import * as S from "./style";
import MainPhoto from "@/components/Information/MainPhoto";
import HumanInfo from "@/components/Information/HumanInfo";
import Greeting from "@/components/Information/Greeting";
import ProgressBar from "@/components/Information/ProgressBar";
import Contact from "@/components/Information/Contact";
import Account from "@/components/Information/Account";
import SlidePhotos from "@/components/Information/SlidePhotos";
import WeddingSchedule from "@/components/Information/WeddingSchedule";
import MasterPassword from "@/components/Information/MasterPassword";
import BackGroundMusic from "@/components/Information/BackGroundMusic";
import YoutubeVideo from "@/components/Information/YoutubeVideo";
import LiveWedding from "@/components/Information/LiveWedding";
import ShareKakao from "@/components/Information/ShareKakao";
import NextStepButton from "@/components/Common/NextStepButton";
import TempSaveButton from "@/components/Information/TempSaveButton";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "@/apis/server";
// import Test from "@/components/Information/test";
import { useRecoilValue } from "recoil";
import { invitationJSONState } from "@/stores/createInvitationJSONStore";
import { invitationPhotosState } from "@/stores/createInvitationPhotosStore";

const Information = () => {
  const createInvitationData = useRecoilValue(invitationJSONState);
  const createInvitationPhotos = useRecoilValue(invitationPhotosState);

  const navigate = useNavigate();

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", preventClose);

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  const handleClickLeft = async () => {
    const res = await postData({
      JsonData: createInvitationData,
      Images: createInvitationPhotos,
      isTemp: true,
    });
    console.log(res);
    navigate(-1);
  };

  const handleClickRight = async () => {
    const res = await postData({
      JsonData: createInvitationData,
      Images: createInvitationPhotos,
      isTemp: false,
    });
    console.log(res);
  };

  const handleClickTempSave = async () => {
    console.log(createInvitationData, createInvitationPhotos);
    // console.log(createInvitationData, invitationPhotos);
    // const res = await testData({
    //   JsonData: createInvitationData,
    // });
    // console.log(res);
  };

  return (
    <S.Section>
      <ProgressBar />
      <MainPhoto />
      <Greeting />
      <HumanInfo />
      <Contact />
      <Account />
      <SlidePhotos />
      <WeddingSchedule />
      <MasterPassword />
      <BackGroundMusic />
      <YoutubeVideo />
      <LiveWedding />
      <ShareKakao />
      {/* <Test /> */}
      <TempSaveButton FuncOnClick={handleClickTempSave} />
      <NextStepButton ArrowDirection="left" FuncOnClick={handleClickLeft} />
      <NextStepButton ArrowDirection="right" FuncOnClick={handleClickRight} />
    </S.Section>
  );
};

export default Information;
