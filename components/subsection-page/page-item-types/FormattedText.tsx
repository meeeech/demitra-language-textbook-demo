import parse from "html-react-parser";
import "@/styles/text.css";

export default function FormattedText({ htmlString }: { htmlString: string }) {
    return parse(htmlString);
}
