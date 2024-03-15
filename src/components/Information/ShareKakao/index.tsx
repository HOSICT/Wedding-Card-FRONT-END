import { IReqInvitationJSON, IReqInvitationPhotos } from "@/types/invitation";
import * as S from "./style";
import { useRef } from "react";

const ShareKakao = ({
  setCreateInvitationData,
  invitationPhotos,
  setInvitationPhotos,
}: {
  setCreateInvitationData: React.Dispatch<React.SetStateAction<IReqInvitationJSON>>;
  invitationPhotos: IReqInvitationPhotos;
  setInvitationPhotos: React.Dispatch<React.SetStateAction<IReqInvitationPhotos>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleSetImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? undefined;
    if (file) {
      setInvitationPhotos(previousData => ({
        ...previousData,
        kakao_thumbnail: file,
      }));
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateInvitationData(previousData => ({
      ...previousData,
      open_graph: {
        ...previousData.open_graph,
        [e.target.id]: e.target.value,
      },
    }));
  };

  return (
    <S.Container>
      <h1>카카오톡 공유 썸네일을 설정해주세요.</h1>
      <h3>청첩장 하단의 [카카오톡 공유하기]로 전달할 때 표시됩니다.</h3>
      <S.TextWrapper onChange={handleChangeInput}>
        <div className="input-container">
          <span>제목</span>
          <input placeholder="제목 (예: 신랑♡신부)" id="title" />
        </div>
        <div className="input-container">
          <span>내용</span>
          <input placeholder="내용 (예:우리 결혼합니다)" id="subtitle" />
        </div>
      </S.TextWrapper>
      <S.ImageForm onSubmit={handleSubmit}>
        <div className="img-container">
          {invitationPhotos?.kakao_thumbnail && (
            <img src={URL.createObjectURL(invitationPhotos.kakao_thumbnail)} alt="KakaoThumbnail" />
          )}
          {!invitationPhotos?.kakao_thumbnail && <span>이미지를 업로드 해주세요.</span>}
        </div>
        <input type="file" ref={inputRef} onChange={handleSetImage} />
        <button>사진 업로드</button>
      </S.ImageForm>
    </S.Container>
  );
};

export default ShareKakao;