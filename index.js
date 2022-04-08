import {
  DOMImplementationImpl,
  DOMParserImpl,
  XMLSerializerImpl,
} from "xmldom-ts";

import { install, xsltProcess, getParser } from "xslt-ts";

import fs from "fs";

function xmlParse(xml) {
  const parser = getParser();
  return parser.parseFromString(xml, "text/xml");
}

const xmlString = `
<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns:tei="http://www.tei-c.org/ns/1.0">
   <teiHeader>
      <fileDesc>
         <titleStmt>
            <title>Sample</title>
         </titleStmt>
      </fileDesc>
   </teiHeader>
</TEI>
`;

const xsltString = `
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    version="1.0"
    xmlns:tei="http://www.tei-c.org/ns/1.0">

  <xsl:output method="html" />

  <xsl:template match="/">
    <html>
        <body>
            <xsl:apply-templates/>
        </body>
    </html>
  </xsl:template>

  <xsl:template match="*">
    <xsl:choose>
        <xsl:when test="name() = 'titleStmt'">
            <div>Title: <xsl:value-of select="title"/></div>
        </xsl:when>
        <xsl:otherwise>
            <xsl:apply-templates/>
        </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
`;

install(
  new DOMParserImpl(),
  new XMLSerializerImpl(),
  new DOMImplementationImpl()
);
const output = xsltProcess(xmlParse(xmlString), xmlParse(xsltString));

fs.writeFileSync("output.html", output);
