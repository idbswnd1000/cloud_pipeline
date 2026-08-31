import styled from "styled-components";

import ImageUploader from "../components/ImageUploader";
import { useAnalyzeImage } from "../query/imageRagQuery";


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
        <UploaderCard>
          <ImageUploader
            onAnalyze={handleAnalyze}
            isPending={isPending}
          />
        </UploaderCard>

        {isError && (
          <ErrorMessage>
            <ErrorTitle>
              이미지 분석에 실패했습니다.
            </ErrorTitle>

            <ErrorDescription>
              {error?.message ||
                "잠시 후 다시 시도해주세요."}
            </ErrorDescription>
          </ErrorMessage>
        )}

        {data && (
          <ResultContainer>
            <ResultHeader>
              <ResultLabel>
                ANALYSIS RESULT
              </ResultLabel>

              <FoodName>
                {data.food_name}
              </FoodName>

              <Description>
                {data.description}
              </Description>

              {data.matched_folder && (
                <MatchedFolder>
                  <FolderBadge>
                    검색 폴더
                  </FolderBadge>

                  {data.matched_folder}
                </MatchedFolder>
              )}
            </ResultHeader>

            {data.images?.length > 0 && (
              <ImageSection>
                <ImageSectionHeader>
                  <ImageTitle>
                    관련 이미지
                  </ImageTitle>

                  <ImageCount>
                    {data.images.length}개
                  </ImageCount>
                </ImageSectionHeader>

                <ImageGrid>
                  {data.images.map(
                    (image, index) => (
                      <ImageCard
                        key={index}
                      >
                        <ResultImage
                          src={image}
                          alt={`${data.food_name}-${index}`}
                        />
                      </ImageCard>
                    ),
                  )}
                </ImageGrid>
              </ImageSection>
            )}
          </ResultContainer>
        )}
      </Content>
    </PageContainer>
  );
};


export default ImageRagPage;


const PageContainer = styled.main`
  min-height: calc(100vh - 68px);

  padding: 52px 20px 80px;

  background: #f8f9fb;

  box-sizing: border-box;
`;

const Content = styled.div`
  width: 100%;
  max-width: 920px;

  margin: 0 auto;
`;

const UploaderCard = styled.section`
  padding: 42px;

  background: white;

  border: 1px solid #e8eaed;
  border-radius: 18px;

  box-shadow:
    0 8px 30px rgba(17, 24, 39, 0.04);

  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const ResultContainer = styled.section`
  margin-top: 24px;

  padding: 36px;

  background: white;

  border: 1px solid #e8eaed;
  border-radius: 18px;

  box-shadow:
    0 8px 30px rgba(17, 24, 39, 0.04);

  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const ResultHeader = styled.div`
  padding-bottom: 30px;

  border-bottom: 1px solid #edf0f2;
`;

const ResultLabel = styled.span`
  display: block;

  margin-bottom: 10px;

  color: #9ca3af;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 1.2px;
`;

const FoodName = styled.h2`
  margin: 0 0 12px;

  color: #111827;

  font-size: 30px;

  letter-spacing: -0.7px;
`;

const Description = styled.p`
  margin: 0;

  color: #4b5563;

  font-size: 15px;

  line-height: 1.8;
`;

const MatchedFolder = styled.div`
  margin-top: 18px;

  display: flex;
  align-items: center;

  gap: 8px;

  color: #6b7280;

  font-size: 13px;
`;

const FolderBadge = styled.span`
  padding: 5px 8px;

  border-radius: 6px;

  background: #f3f4f6;
  color: #4b5563;

  font-size: 11px;
  font-weight: 600;
`;

const ImageSection = styled.div`
  margin-top: 30px;
`;

const ImageSectionHeader = styled.div`
  margin-bottom: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ImageTitle = styled.h3`
  margin: 0;

  color: #111827;

  font-size: 17px;
`;

const ImageCount = styled.span`
  color: #9ca3af;

  font-size: 12px;
`;

const ImageGrid = styled.div`
  display: grid;

  grid-template-columns:
    repeat(
      auto-fill,
      minmax(210px, 1fr)
    );

  gap: 16px;
`;

const ImageCard = styled.div`
  overflow: hidden;

  border-radius: 12px;

  background: #f3f4f6;

  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);

    box-shadow:
      0 8px 20px
      rgba(17, 24, 39, 0.08);
  }
`;

const ResultImage = styled.img`
  width: 100%;
  height: 190px;

  display: block;

  object-fit: cover;
`;

const ErrorMessage = styled.div`
  margin-top: 20px;

  padding: 18px 20px;

  border: 1px solid #fecaca;
  border-radius: 12px;

  background: #fff7f7;
`;

const ErrorTitle = styled.div`
  color: #b91c1c;

  font-size: 14px;
  font-weight: 600;
`;

const ErrorDescription = styled.div`
  margin-top: 5px;

  color: #dc2626;

  font-size: 13px;
`;