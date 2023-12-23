import type { Database as DB } from "~/lib/database.types";

declare global {
	type Database = DB;
	type Transaction = DB["public"]["Tables"]["transactions"]["Row"];
}
