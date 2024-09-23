import Autolinker from "autolinker";
import parse from "html-react-parser";

export default function Paragraph({ content }: { content?: string }) {

    return (<p
        className="text-slate-400"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
    >
        {content ? parse(Autolinker.link(content, {
            stripPrefix: false, replaceFn: (match) => {
                const tag = match.buildTag();
                tag.setAttr('rel', 'noopener noreferrer');
                tag.addClass('font-medium hover:underline');
                return tag;
            }
        })) : ""}
    </p>);
}