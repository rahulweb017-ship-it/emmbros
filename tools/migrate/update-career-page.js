import fs from "node:fs";

let code = fs.readFileSync("client/src/pages/Career.jsx", "utf8");

// 1. Add import
code = code.replace(
  'import { PageMeta } from "../components/common/PageMeta";',
  'import { PageMeta } from "../components/common/PageMeta";\nimport { CareerForm } from "../components/forms/CareerForm";'
);

// 2. Replace the old wpcf7 form container with <CareerForm />
const formStart = '<div className="elementor-shortcode">';
const formEnd = '</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t</div>';

const startIdx = code.indexOf(formStart);
if (startIdx !== -1) {
  const afterStart = code.slice(startIdx);
  const endIdx = afterStart.indexOf('</form>');
  if (endIdx !== -1) {
    const totalEnd = startIdx + endIdx + '</form>'.length;
    // Look for closing wrapper divs
    const rest = code.slice(totalEnd);
    const divCloseIdx = rest.indexOf('</div>\n\t\t\t\t\t\t</div>');
    const cutEnd = totalEnd + divCloseIdx + '</div>\n\t\t\t\t\t\t</div>'.length;
    
    code = code.slice(0, startIdx) + '<CareerForm />' + code.slice(cutEnd);
    fs.writeFileSync("client/src/pages/Career.jsx", code);
    console.log("Successfully replaced legacy form with <CareerForm /> in Career.jsx");
  } else {
    console.warn("Could not find </form>");
  }
} else {
  console.warn("Could not find elementor-shortcode");
}
