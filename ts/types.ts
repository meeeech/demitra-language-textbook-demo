type Unit = {
    unit_id: string;
    unit_frgn_prefix: string;
    title: string;
    sections?: Array<Section>;
};

type Section = {
    section_id: string;
    section_frgn_prefix: string;
    title: string;
    subsections?: Array<Subsection>;
    exercises?: Array<Exercise>;
};

type Subsection = {
    subsection_id: string;
    title_en: string;
    title_frgn: string | null;
    page_items?: Array<PageItem>;
};

type Exercise = {
    exercise_id: string;
    title: string;
    instructions: string;
    example: any;
    questions?: Array<Question> | null;
};

type PageItem = {
    order: number;
    type: PageItemType; // Use the enum here
    title?: string;
    content: string | AudioTable | PlainTable;
};

type Question = {
    question: string;
    type: QuestionType;
    choices?: Array<string> | null;
    correct_choice?: string | null;
};

enum PageItemType {
    AudioTable = "audio_table",
    PlainTable = "plain_table",
    FormattedText = "formatted_text",
}

enum QuestionType {
    MultipleChoice = "multiple_choice",
    FreeResponse = "free_response",
}

type AudioTable = Array<AudioTableRow>;

type PlainTable = Array<{ [key: string]: string }>;

type FormattedText = string;

type AudioTableRow = {
    audio_file: string;
    text_en: string;
    text_frgn: string;
};
