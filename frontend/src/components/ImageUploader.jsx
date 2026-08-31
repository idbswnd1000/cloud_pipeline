import { useRef, useState } from "react";
import styled from "styled-components";


const ImageUploader = ({
  onAnalyze,
  isPending,
}) => {
  const [file, setFile] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const inputRef = useRef(null);


  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    const previewUrl =
      URL.createObjectURL(
        selectedFile,
      );

    setPreview(previewUrl);
  };


  const handleAnalyze = () => {
    if (!file) {
      alert(
        "이미지를 선택해주세요.",
      );

      return;
    }

    onAnalyze(file);
  };


  return (
    <Container>
      <HeaderArea>
        <Badge>AI IMAGE ANALYSIS</Badge>

        <Title>
          음식 이미지 분석
        </Title>

        <Description>
          음식 사진을 업로드하면 AI가
          이미지를 분석하고 관련 이미지를
          검색합니다.
        </Description>
      </HeaderArea>

      <UploadBox
        onClick={() =>
          inputRef.current?.click()
        }
      >
        <FileInput
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview ? (
          <PreviewWrapper>
            <PreviewImage
              src={preview}
              alt="preview"
            />

            <ChangeText>
              클릭하여 다른 이미지 선택
            </ChangeText>
          </PreviewWrapper>
        ) : (
          <EmptyUpload>
            <UploadIcon>
              ↑
            </UploadIcon>

            <UploadTitle>
              이미지를 업로드하세요
            </UploadTitle>

            <UploadDescription>
              클릭하여 이미지 파일을 선택하세요
            </UploadDescription>

            <FormatText>
              JPG, PNG, WEBP
            </FormatText>
          </EmptyUpload>
        )}
      </UploadBox>

      {file && (
        <FileInfo>
          <FileName>
            {file.name}
          </FileName>

          <FileSize>
            {(
              file.size /
              1024 /
              1024
            ).toFixed(2)}
            {" MB"}
          </FileSize>
        </FileInfo>
      )}

      <AnalyzeButton
        onClick={handleAnalyze}
        disabled={
          isPending || !file
        }
      >
        {isPending
          ? "AI가 이미지를 분석하고 있습니다..."
          : "이미지 분석하기"}
      </AnalyzeButton>
    </Container>
  );
};


export default ImageUploader;


const Container = styled.div`
  width: 100%;
`;

const HeaderArea = styled.div`
  margin-bottom: 28px;
`;

const Badge = styled.span`
  display: inline-block;

  margin-bottom: 10px;

  color: #6b7280;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 1.2px;
`;

const Title = styled.h1`
  margin: 0 0 10px;

  color: #111827;

  font-size: 28px;
  font-weight: 700;

  letter-spacing: -0.7px;
`;

const Description = styled.p`
  max-width: 580px;

  margin: 0;

  color: #6b7280;

  font-size: 14px;

  line-height: 1.7;
`;

const UploadBox = styled.div`
  min-height: 340px;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 24px;

  border: 1.5px dashed #cfd4dc;
  border-radius: 16px;

  background: #fafbfc;

  cursor: pointer;

  box-sizing: border-box;

  transition: 0.2s;

  &:hover {
    border-color: #6b7280;

    background: #f7f8fa;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const EmptyUpload = styled.div`
  text-align: center;
`;

const UploadIcon = styled.div`
  width: 50px;
  height: 50px;

  margin: 0 auto 18px;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 14px;

  background: #111827;
  color: white;

  font-size: 25px;
`;

const UploadTitle = styled.div`
  margin-bottom: 7px;

  color: #111827;

  font-size: 16px;
  font-weight: 600;
`;

const UploadDescription = styled.div`
  color: #6b7280;

  font-size: 13px;
`;

const FormatText = styled.div`
  margin-top: 8px;

  color: #9ca3af;

  font-size: 11px;
`;

const PreviewWrapper = styled.div`
  width: 100%;

  text-align: center;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 520px;
  height: 300px;

  object-fit: contain;

  border-radius: 12px;

  background: #f3f4f6;
`;

const ChangeText = styled.div`
  margin-top: 14px;

  color: #6b7280;

  font-size: 12px;
`;

const FileInfo = styled.div`
  margin-top: 12px;

  padding: 12px 14px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1px solid #e8eaed;
  border-radius: 9px;

  background: #fafafa;
`;

const FileName = styled.span`
  overflow: hidden;

  color: #374151;

  font-size: 13px;

  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FileSize = styled.span`
  margin-left: 20px;

  color: #9ca3af;

  font-size: 12px;
`;

const AnalyzeButton = styled.button`
  width: 100%;
  height: 52px;

  margin-top: 18px;

  border: none;
  border-radius: 10px;

  background: #111827;
  color: white;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s;

  &:hover:not(:disabled) {
    background: #1f2937;
  }

  &:disabled {
    background: #d1d5db;

    cursor: not-allowed;
  }
`;