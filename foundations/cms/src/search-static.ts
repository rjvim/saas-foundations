import { source } from "@foundations/cms/source";
import { createFromSource } from "fumadocs-core/search/server";

export const { staticGET: GET } = createFromSource(source);
