function parseDocument() {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var elements = body.getNumChildren();
    var parsedData = {
        subsection_id: "",
        title_en: "",
        title_frgn: "",
        page_items: [],
        section_id: "",
    };

    // Extracting subsection ID, title_en, and title_frgn
    if (elements >= 3) {
        var subsectionText = body.getChild(0).asParagraph().getText();
        if (subsectionText.startsWith("Subsection")) {
            parsedData.subsection_id = subsectionText.split(" ")[1].trim();
            var sectionId = parsedData.subsection_id
                .split(".")
                .slice(0, 2)
                .join(".");
            parsedData.section_id = sectionId;
        }

        var titleEnText = body.getChild(1).asParagraph().getText();
        if (titleEnText.startsWith("Title:")) {
            parsedData.title_en = titleEnText.split(":")[1].trim();
        }

        var titleFrgnText = body.getChild(2).asParagraph().getText();
        if (titleFrgnText.startsWith("German Title:")) {
            parsedData.title_frgn = titleFrgnText.split(":")[1].trim();
        }
    }

    var pageContentStarted = false;
    var order = 0;
    var pageItemTitle = null; // Variable for storing the title
    for (var i = 0; i < elements; i++) {
        var element = body.getChild(i);
        var elementType = element.getType();

        if (elementType === DocumentApp.ElementType.PARAGRAPH) {
            var paragraph = element.asParagraph();
            var text = paragraph.getText().trim();

            if (pageContentStarted) {
                // Check if the paragraph is a title
                if (text.startsWith("Header: ")) {
                    pageItemTitle = text.substring("Header: ".length); // Extract title text
                    continue; // Skip further processing for title
                }

                if (text === "[Audio Table]" || text === "[Plain Table]") {
                    continue; // Skip to the next element (the table)
                }

                if (text !== "") {
                    var cleanText = text.replace(/\r/g, "");
                    var textWithSpans = addSpansToBoldAndColoredText(
                        paragraph,
                        cleanText,
                    );

                    var item = {
                        order: order,
                        type: "paragraph",
                        content: textWithSpans,
                    };
                    if (pageItemTitle) {
                        item.title = pageItemTitle;
                        pageItemTitle = null; // Reset the title for the next items
                    }
                    parsedData.page_items.push(item);
                    order++;
                }
            }

            if (text === "PAGE CONTENT:") {
                pageContentStarted = true;
            }
        } else if (
            elementType === DocumentApp.ElementType.TABLE &&
            pageContentStarted
        ) {
            var table = element.asTable();
            var tableType = body
                .getChild(i - 1)
                .asParagraph()
                .getText()
                .trim();
            var tableContent;

            if (tableType === "[Audio Table]") {
                tableContent = parseAudioTable(table);
            } else if (tableType === "[Plain Table]") {
                tableContent = parsePlainTable(table);
            }

            var item = {
                order: order,
                type:
                    tableType === "[Audio Table]"
                        ? "audio_table"
                        : "plain_table",
                content: tableContent,
            };

            if (pageItemTitle) {
                item.title = pageItemTitle;
                pageItemTitle = null;
            }

            parsedData.page_items.push(item);
            order++;
        }
    }

    var json = JSON.stringify(parsedData, null, 2);
    Logger.log(json);
}

function addSpansToBoldAndColoredText(paragraph, text) {
    var textElement = paragraph.editAsText();
    var formattedText = "";
    var lastColor = null;
    var isBold = false;
    var inColoredSpan = false;

    for (var i = 0; i < text.length; i++) {
        var color = textElement.getForegroundColor(i);
        var currentBold = textElement.isBold(i);

        // Handle colored text
        if (color !== lastColor) {
            if (inColoredSpan) {
                // Close the previous colored span
                formattedText += "</span>";
                inColoredSpan = false;
            }
            if (color === "#0000ff") {
                // Blue text starts
                formattedText += "<span class='en'>";
                inColoredSpan = true;
            } else if (color === "#ff0000") {
                // Red text starts
                formattedText += "<span class='frgn'>";
                inColoredSpan = true;
            }
        }

        // Handle bold text
        if (currentBold && !isBold && !inColoredSpan) {
            formattedText += "<span class='bold'>";
            isBold = true;
        } else if (!currentBold && isBold && !inColoredSpan) {
            formattedText += "</span>";
            isBold = false;
        }

        formattedText += text.charAt(i);
        lastColor = color;
    }

    return formattedText;
}

function parseAudioTable(table) {
    var audioTable = [];
    for (var i = 0; i < table.getNumRows(); i++) {
        var row = table.getRow(i);

        var textFrgnCell = row.getCell(1).editAsText();
        var textEnCell = row.getCell(2).editAsText();

        var textFrgnWithSpans = addSpansToBoldAndColoredText(
            row.getCell(1),
            textFrgnCell.getText(),
        );
        var textEnWithSpans = addSpansToBoldAndColoredText(
            row.getCell(2),
            textEnCell.getText(),
        );

        var audioTableRow = {
            audio_file: row.getCell(0).getText(),
            text_frgn: textFrgnWithSpans,
            text_en: textEnWithSpans,
        };
        audioTable.push(audioTableRow);
    }
    return audioTable;
}

function parsePlainTable(table) {
    var plainTable = [];
    var headers = [];

    // Assuming the first row contains headers
    for (var i = 0; i < table.getRow(0).getNumCells(); i++) {
        headers.push(table.getRow(0).getCell(i).getText().trim());
    }

    // Parsing the rest of the rows based on these headers
    for (var row = 1; row < table.getNumRows(); row++) {
        var tableRow = {};
        for (var cell = 0; cell < table.getRow(row).getNumCells(); cell++) {
            var cellText = table.getRow(row).getCell(cell).getText().trim();
            tableRow[headers[cell]] = cellText;
        }
        plainTable.push(tableRow);
    }

    return plainTable;
}
