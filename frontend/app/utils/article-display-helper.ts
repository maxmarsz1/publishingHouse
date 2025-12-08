import { ArticleType, ITArticleCategory } from "../types/types";

const articleTypeDisplayMap: { [key in ArticleType]: string } = {
    [ArticleType.OriginalResearch]: "Artykuł oryginalny",
    [ArticleType.ReviewArticle]: "Artykuł przeglądowy",
    [ArticleType.SystematicReview]: "Przegląd systematyczny",
    [ArticleType.MetaAnalysis]: "Metaanaliza",
    [ArticleType.CaseReport]: "Raport przypadku / Studium przypadku",
    [ArticleType.ShortCommunication]: "Krótki komunikat / Krótki raport",
    [ArticleType.MethodArticle]: "Artykuł metodologiczny",
    [ArticleType.Commentary]: "Komentarz / Opinia / List do redakcji",
    [ArticleType.TheoreticalPaper]: "Artykuł teoretyczny",
    [ArticleType.ClinicalTrialReport]: "Raport z badania klinicznego",
    [ArticleType.SoftwareToolArticle]: "Artykuł oprogramowania",
    [ArticleType.TechnicalReport]: "Raport techniczny",
    [ArticleType.Other]: "Inny",
};

export const getArticleTypeDisplayText = (type: ArticleType): string => {
    return articleTypeDisplayMap[type] || "Nieznany";
};

const itArticleCategoryDisplayMap: { [key in ITArticleCategory]: string } = {
    [ITArticleCategory.ArtificialIntelligence]: "Sztuczna Inteligencja (AI)",
    [ITArticleCategory.MachineLearning]: "Uczenie Maszynowe (ML)",
    [ITArticleCategory.DataScience]: "Data Science / Analiza Danych",
    [ITArticleCategory.Cybersecurity]: "Cyberbezpieczeństwo",
    [ITArticleCategory.CloudComputing]: "Przetwarzanie w Chmurze (Cloud Computing)",
    [ITArticleCategory.WebDevelopment]: "Tworzenie Aplikacji Webowych",
    [ITArticleCategory.MobileDevelopment]: "Tworzenie Aplikacji Mobilnych",
    [ITArticleCategory.GameDevelopment]: "Tworzenie Gier",
    [ITArticleCategory.DevOps]: "DevOps",
    [ITArticleCategory.Networking]: "Sieci Komputerowe",
    [ITArticleCategory.Databases]: "Bazy Danych",
    [ITArticleCategory.OperatingSystems]: "Systemy Operacyjne",
    [ITArticleCategory.SoftwareEngineering]: "Inżynieria Oprogramowania",
    [ITArticleCategory.ComputerGraphics]: "Grafika Komputerowa",
    [ITArticleCategory.Robotics]: "Robotyka",
    [ITArticleCategory.InternetOfThings]: "Internet Rzeczy (IoT)",
    [ITArticleCategory.Blockchain]: "Blockchain / Kryptowaluty",
    [ITArticleCategory.QuantumComputing]: "Obliczenia Kwantowe",
    [ITArticleCategory.HumanComputerInteraction]: "Interakcja Człowiek-Komputer (HCI)",
    [ITArticleCategory.Other]: "Inne",
};

export const getArticleCategoryDisplayText = (category: ITArticleCategory): string => {
    return itArticleCategoryDisplayMap[category] || "Nieznana";
};
