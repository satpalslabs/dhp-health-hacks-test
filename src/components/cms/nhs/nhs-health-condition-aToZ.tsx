"use client";

import { AppSettingsContext } from "@/context/app-settings-prvider";
import { getNHSData } from "@/lib/services/nhs-services";
import React, { useContext, useEffect, useState } from "react";
import NHSMainPage from ".";
import { NHSConditionsContext } from "@/context/nhs-conditions-provider";

const NHSHealthConditions = () => {
  const appSettings = useContext(AppSettingsContext);
  const { NHSConditions, setNHSConditions } = useContext(NHSConditionsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    if (NHSConditions.length === 0 && appSettings) {
      const nhsData = await getNHSData(
        appSettings.meta.collections.nhs_health_az_api_schema_id
      );
      setLoading(false);
      setNHSConditions(nhsData);
    } else {
      setLoading(false);
    }
  };

  return <NHSMainPage conditions={NHSConditions} loading={loading} />;
};

export default NHSHealthConditions;
