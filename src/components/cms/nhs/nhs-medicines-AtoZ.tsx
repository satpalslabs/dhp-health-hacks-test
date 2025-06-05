"use client";

import { AppSettingsContext } from "@/context/app-settings-prvider";
import { getNHSData } from "@/lib/services/nhs-services";
import React, { useContext, useEffect, useState } from "react";
import NHSMainPage from ".";
import { NHSMedicinesContext } from "@/context/nhs-medicines-provider";

const NHSMedicinesAtoZ = () => {
  const appSettings = useContext(AppSettingsContext);
  const { NHSMedicines, setNHSMedicines } = useContext(NHSMedicinesContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (NHSMedicines.length === 0) {
      async function loadData() {
        if (appSettings) {
          const nhsData = await getNHSData(
            appSettings.meta.collections.nhs_medication_az_api_schema_id
          );
          setLoading(false);
          setNHSMedicines(nhsData);
        }
      }
      loadData();
    } else {
      setLoading(false);
    }
  }, [NHSMedicines, appSettings, setNHSMedicines]);

  return <NHSMainPage conditions={NHSMedicines} loading={loading} />;
};

export default NHSMedicinesAtoZ;
