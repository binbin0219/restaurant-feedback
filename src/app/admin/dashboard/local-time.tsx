"use client";

import { useEffect, useState } from "react";
import moment from "moment";

export default function LocalTime({ dateString }: { dateString: string }) {
  const [formatted, setFormatted] = useState<string | null>(null);

  useEffect(() => {
    setFormatted(moment(dateString).format("YYYY-MM-DD HH:mm:ss"));
  }, [dateString]);

  return <>{formatted ?? " "}</>;
}
