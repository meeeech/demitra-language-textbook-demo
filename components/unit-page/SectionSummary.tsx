"use client";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

export default function SectionSummary({ section }: { section: Section }) {
    const { section_id, title, subsections } = section;
    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`section ${section_id} content`}
                id={`${section_id}-header`}
            >
                <Typography variant="h6">{`${section_id} ${title}`}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
                {subsections.map((subsection) => (
                    <ListItem key={subsection.subsection_id} disablePadding>
                        <ListItemButton
                            component="a"
                            href={`/subsection/${subsection.subsection_id}`}
                        >
                            <ListItemText>
                                {`${subsection.subsection_id} ${subsection.title_en} - ${subsection.title_frgn}`}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </AccordionDetails>
        </Accordion>
    );
}
