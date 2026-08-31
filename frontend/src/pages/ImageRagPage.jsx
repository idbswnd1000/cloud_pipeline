import styled from "styled-components";

import ImageUploader from "../components/ImageUploader";
import { useAnalyzeImage } from "../query/imageRagQuery";

const BASE_URL = "http://127.0.0.1:8000";

const ImageRagPage = () => {
  const {
    mutate,
    data,
    isPending,
    isError,
    error,
  } = useAnalyzeImage();

  const handleAnalyze = (file) => {
    mutate(file);
  };

  return (
    <PageContainer>
      <Content>
        <ImageUploader
          onAnalyze={handleAnalyze}
          isPending={isPending}
        />

        {isError && (
          <ErrorMessage>
            이미지 분석 중 오류가 발생했습니다.
            {error?.message}
          </ErrorMessage>
        )}

        {data && (
          <ResultContainer>
            <ResultTitle>
              분석 결과
            </ResultTitle>

            <FoodName>
              {data.food_name}
            </FoodName>

            <Description>
              {data.description}
            </Description>

            {data.matched_folder && (
              <MatchedFolder>
                검색 폴더:
                {" "}
                {data.matched_folder}
              </MatchedFolder>
            )}

            {data.images?.length > 0 && (
              <>
                <ImageTitle>
                  관련 이미지
                </ImageTitle>

                <ImageGrid>
                  {data.images.map(
                    (image, index) => (
                      <ResultImage
                        key={index}
                        src={image}
                        alt={`${data.food_name}-${index}`}
                      />
                    ),
                  )}
                </ImageGrid>
              </>
            )}
          </ResultContainer>
        )}
      </Content>
    </PageContainer>
  );
};

export default ImageRagPage;


const PageContainer = styled.div`
  min-height: 100vh;

  display: flex;
  justify-content: center;

  padding: 60px 20px;

  background: #f7f7f7;
`;

const Content = styled.div`
  width: 100%;
  max-width: 900px;

  padding: 40px;

  background: white;

  border-radius: 16px;

  box-sizing: border-box;
`;

const ResultContainer = styled.div`
  margin-top: 40px;
`;

const ResultTitle = styled.h2`
  margin-bottom: 16px;
`;

const FoodName = styled.h1`
  margin-bottom: 12px;
`;

const Description = styled.p`
  line-height: 1.6;
`;

const MatchedFolder = styled.p`
  margin-top: 10px;

  font-size: 14px;
`;

const ImageTitle = styled.h3`
  margin-top: 30px;
  margin-bottom: 16px;
`;

const ImageGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(200px, 1fr));

  gap: 16px;
`;

const ResultImage = styled.img`
  width: 100%;
  height: 180px;

  object-fit: cover;

  border-radius: 10px;
`;

const ErrorMessage = styled.div`
  margin-top: 20px;

  padding: 15px;

  border-radius: 8px;

  background: #ffeaea;
`;