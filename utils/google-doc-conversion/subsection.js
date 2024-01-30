function parseSubsection() {
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

    for (var i = 0; i < elements; i++) {
        var child = body.getChild(i);
        var element =
            child.getType() === DocumentApp.ElementType.LIST_ITEM
                ? child.asListItem()
                : child.asParagraph();
        var text = element.getText();

        if (text.toLowerCase().startsWith("subsection:")) {
            parsedData.subsection_id = text.split(" ")[1].trim();
            var sectionId = parsedData.subsection_id
                .split(".")
                .slice(0, 2)
                .join(".");
            parsedData.section_id = sectionId;
        } else if (text.toLowerCase().startsWith("title:")) {
            parsedData.title_en = text.split(":")[1].trim();
        } else if (text.toLowerCase().startsWith("german title:")) {
            parsedData.title_frgn = text.split(":")[1].trim();
        } else if (text.toLowerCase().includes("{*page content*}")) {
            break;
        }
    }

    var pageContentStarted = false;
    var order = 0;
    var pageItemTitle = null;
    var listBuffer = [];
    var currentListType = null;

    for (var i = 0; i < elements; i++) {
        var element = body.getChild(i);
        var elementType = element.getType();

        if (
            elementType === DocumentApp.ElementType.PARAGRAPH ||
            elementType === DocumentApp.ElementType.LIST_ITEM
        ) {
            var textElement;
            var text;

            if (elementType === DocumentApp.ElementType.PARAGRAPH) {
                textElement = element.asParagraph().editAsText();
                text = textElement.getText();
            } else if (elementType === DocumentApp.ElementType.LIST_ITEM) {
                textElement = element.asListItem().editAsText();
                text = textElement.getText();
            }

            if (text.toLowerCase() === "{*page content*}") {
                pageContentStarted = true;
                continue;
            }

            if (text.toLowerCase().startsWith("{*header*}: ")) {
                pageItemTitle = text.substring("{*header*}: ".length); // Extract title text
                continue; // Skip further processing for title
            }

            if (pageContentStarted) {
                if (
                    text.toLowerCase() === "{*audio table*}" ||
                    text.toLowerCase() === "{*plain table*}"
                ) {
                    continue;
                }

                if (elementType === DocumentApp.ElementType.LIST_ITEM) {
                    var listItem = element.asListItem();
                    var glyphType = listItem.getGlyphType();
                    handleList(glyphType, listItem, text);
                } else {
                    flushListBuffer();
                    if (text !== "" && text.trim().length > 0) {
                        // Check that text is not just whitespace
                        var htmlContent =
                            "<p>" +
                            addSpansToBoldAndColoredText(textElement, text) +
                            "</p>";
                        addPageItem(htmlContent);
                    }
                }
            }
        } else if (
            elementType === DocumentApp.ElementType.TABLE &&
            pageContentStarted
        ) {
            // Handle tables
            flushListBuffer(); // Close any open list
            var table = element.asTable();
            var tableType = body
                .getChild(i - 1)
                .asParagraph()
                .getText()
                .trim();
            var tableContent;

            if (tableType.toLowerCase() === "{*audio table*}") {
                tableContent = parseAudioTable(table);
            } else if (tableType.toLowerCase() === "{*plain table*}") {
                tableContent = parsePlainTable(table);
            }

            var item = {
                order: order,
                type:
                    tableType.toLowerCase() === "{*audio table*}"
                        ? "audio_table"
                        : "plain_table",
                content: tableContent,
                title: pageItemTitle,
            };

            parsedData.page_items.push(item);
            order++;
        }
    }

    flushListBuffer(); // Flush any remaining list items

    function handleList(glyphType, listItem, text) {
        var listTag = glyphType === DocumentApp.GlyphType.NUMBER ? "ol" : "ul";
        if (currentListType !== listTag) {
            flushListBuffer(); // Close previous list
            currentListType = listTag;
        }
        var textElement = listItem.editAsText();
        listBuffer.push(
            "<li>" + addSpansToBoldAndColoredText(textElement, text) + "</li>",
        );
    }

    function flushListBuffer() {
        if (listBuffer.length > 0 && currentListType) {
            addPageItem(
                "<" +
                    currentListType +
                    ">" +
                    listBuffer.join("") +
                    "</" +
                    currentListType +
                    ">",
            );
            listBuffer = [];
            currentListType = null;
        }
    }

    function addPageItem(htmlContent) {
        if (htmlContent !== "") {
            var item = {
                order: order++,
                type: "formatted_text",
                content: htmlContent,
                title: pageItemTitle,
            };

            parsedData.page_items.push(item);
        }
    }

    var json = JSON.stringify(parsedData, null, 2);
    Logger.log(json);
}

function parseAudioTable(table) {
    var audioTable = [];
    for (var i = 0; i < table.getNumRows(); i++) {
        var row = table.getRow(i);

        // Get Text objects from each cell
        var textFrgn = row.getCell(1).editAsText();
        var textEn = row.getCell(2).editAsText();

        // Use the Text objects to apply spans
        var textFrgnWithSpans = addSpansToBoldAndColoredText(
            textFrgn,
            textFrgn.getText(),
        );
        var textEnWithSpans = addSpansToBoldAndColoredText(
            textEn,
            textEn.getText(),
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
            // Extracting Text object from each cell
            var cellTextObject = table.getRow(row).getCell(cell).editAsText();
            var cellText = cellTextObject.getText().trim();

            // Apply text formatting
            var formattedCellText = addSpansToBoldAndColoredText(
                cellTextObject,
                cellText,
            );
            tableRow[headers[cell]] = formattedCellText;
        }
        plainTable.push(tableRow);
    }

    return plainTable;
}
