enum PageItemType {
    Paragraph = "paragraph",
    AudioTable = "audio_table",
    PlainTable = "plain_table",
    Text = "text",
}

type AudioTable = Array<AudioTableRow>;

type AudioTableRow = {
    audio_file: string;
    text_en: string;
    text_frgn: string;
};

type PlainTable = Array<{ [key: string]: string }>;

type Paragraph = string;

type PageItem = {
    order: number;
    type: PageItemType; // Use the enum here
    title?: string;
    content: string | AudioTable | PlainTable;
};

type Subsection = {
    subsection_id: string;
    title_en: string;
    title_frgn: string;
    page_items?: Array<PageItem>;
};

type Section = {
    section_id: string;
    section_frgn_prefix: string;
    title: string;
    subsections: Array<Subsection>;
};

type Unit = {
    unit_id: string;
    unit_frgn_prefix: string;
    title: string;
    sections?: Array<Section>;
};
