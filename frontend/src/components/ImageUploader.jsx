import { useState } from "react";
import styled from "styled-components";

const ImageUploader = ({
  onAnalyze,
  isPending,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    const previewUrl = URL.createObjectURL(
      selectedFile,
    );

    setPreview(previewUrl);
  };

  const handleAnalyze = () => {
    if (!file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    onAnalyze(file);
  };

  return (
    <Container>
      <Title>음식 이미지 분석</Title>

      <UploadBox>
        <FileInput
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview && (
          <PreviewImage
            src={preview}
            alt="preview"
          />
        )}
      </UploadBox>

      <AnalyzeButton
        onClick={handleAnalyze}
        disabled={isPending}
      >
        {isPending
          ? "분석 중..."
          : "이미지 분석"}
      </AnalyzeButton>
    </Container>
  );
};

export default ImageUploader;


const Container = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const UploadBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  padding: 24px;

  border: 2px dashed #cccccc;
  border-radius: 12px;
`;

const FileInput = styled.input`
  cursor: pointer;
`;

const PreviewImage = styled.img`
  width: 100%;
  max-width: 400px;
  height: 300px;

  object-fit: cover;

  border-radius: 12px;
`;

const AnalyzeButton = styled.button`
  margin-top: 20px;

  width: 100%;
  height: 48px;

  border: none;
  border-radius: 8px;

  cursor: pointer;

  font-size: 16px;
  font-weight: 600;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;