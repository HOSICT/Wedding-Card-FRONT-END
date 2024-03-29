import { IReqInvitationJSON, IReqInvitationPhotos } from "@/types/invitation";
import { formInstance, instance } from "./axios";
import { getUserInfo } from "./kakao";

export const postData = async ({
  JsonData,
  Images,
  isTemp,
}: {
  JsonData: IReqInvitationJSON;
  Images: IReqInvitationPhotos;
  isTemp: boolean;
}) => {
  const formData = new FormData();

  if (Images.main_photo) {
    formData.append("mainImage", Images.main_photo);
  }

  if (Images.slide_photos) {
    Images.slide_photos.forEach(image => {
      formData.append(`images${image.index + 1}`, image.file);
    });
  }

  if (Images.kakao_thumbnail) {
    formData.append("thumbnail", Images.kakao_thumbnail);
  }

  formData.append("json", new Blob([JSON.stringify(JsonData)], { type: "application/json" }));
  const uid = await getUserInfo();
  console.log(uid);

  const res = await formInstance.post(`/save/${isTemp ? "temp" : "information"}`, formData, {
    headers: { uid: uid.id },
  });
  return res;
};

export const testData = async ({ JsonData }: { JsonData: IReqInvitationJSON }) => {
  const res = await instance.post("/test", JsonData);
  return res;
};
