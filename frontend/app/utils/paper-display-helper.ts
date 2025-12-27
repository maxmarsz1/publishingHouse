import { PaperType, ITPaperCategory } from "../types/types";

const paperTypeDisplayMap: { [key in PaperType]: string } = {
    [PaperType.OriginalResearch]: "Artykuł oryginalny",
    [PaperType.ReviewArticle]: "Artykuł przeglądowy",
    [PaperType.SystematicReview]: "Przegląd systematyczny",
    [PaperType.MetaAnalysis]: "Metaanaliza",
    [PaperType.CaseReport]: "Raport przypadku / Studium przypadku",
    [PaperType.ShortCommunication]: "Krótki komunikat / Krótki raport",
    [PaperType.MethodArticle]: "Artykuł metodologiczny",
    [PaperType.Commentary]: "Komentarz / Opinia / List do redakcji",
    [PaperType.TheoreticalPaper]: "Artykuł teoretyczny",
    [PaperType.ClinicalTrialReport]: "Raport z badania klinicznego",
    [PaperType.SoftwareToolArticle]: "Artykuł oprogramowania",
    [PaperType.TechnicalReport]: "Raport techniczny",
    [PaperType.Other]: "Inny",
};

export const getPaperTypeDisplayText = (type: PaperType): string => {
    return paperTypeDisplayMap[type] || "Nieznany";
};

const itPaperCategoryDisplayMap: { [key in ITPaperCategory]: string } = {
    [ITPaperCategory.ArtificialIntelligence]: "Sztuczna Inteligencja (AI)",
    [ITPaperCategory.MachineLearning]: "Uczenie Maszynowe (ML)",
    [ITPaperCategory.DataScience]: "Data Science / Analiza Danych",
    [ITPaperCategory.Cybersecurity]: "Cyberbezpieczeństwo",
    [ITPaperCategory.CloudComputing]: "Przetwarzanie w Chmurze (Cloud Computing)",
    [ITPaperCategory.WebDevelopment]: "Tworzenie Aplikacji Webowych",
    [ITPaperCategory.MobileDevelopment]: "Tworzenie Aplikacji Mobilnych",
    [ITPaperCategory.GameDevelopment]: "Tworzenie Gier",
    [ITPaperCategory.DevOps]: "DevOps",
    [ITPaperCategory.Networking]: "Sieci Komputerowe",
    [ITPaperCategory.Databases]: "Bazy Danych",
    [ITPaperCategory.OperatingSystems]: "Systemy Operacyjne",
    [ITPaperCategory.SoftwareEngineering]: "Inżynieria Oprogramowania",
    [ITPaperCategory.ComputerGraphics]: "Grafika Komputerowa",
    [ITPaperCategory.Robotics]: "Robotyka",
    [ITPaperCategory.InternetOfThings]: "Internet Rzeczy (IoT)",
    [ITPaperCategory.Blockchain]: "Blockchain / Kryptowaluty",
    [ITPaperCategory.QuantumComputing]: "Obliczenia Kwantowe",
    [ITPaperCategory.HumanComputerInteraction]: "Interakcja Człowiek-Komputer (HCI)",
    [ITPaperCategory.Other]: "Inne",
};

export const getPaperCategoryDisplayText = (category: ITPaperCategory): string => {
    return itPaperCategoryDisplayMap[category] || "Nieznana";
};
