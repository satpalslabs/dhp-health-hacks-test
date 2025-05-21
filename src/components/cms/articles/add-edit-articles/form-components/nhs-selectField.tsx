import { AppSettingsContext } from "@/context/app-settings-prvider";
import { getNHSData } from "@/lib/services/nhs-services";
import React, { useContext, useEffect, useState } from "react";
import SelectField from "./select-field";
import { TypeOf, z } from "zod";
import { Path, PathValue, UseFormReturn } from "react-hook-form";
import { SelectOptions } from "./render-webpage-component";
import { NHSMedicinesContext } from "@/context/nhs-medicines-provider";
import { NHSConditionsContext } from "@/context/nhs-conditions-provider";

const NHS_SelectField = <T extends z.ZodType>({
  form,
  sourceId,
  ableToSearchNHSArticle,
}: {
  form: UseFormReturn<z.infer<T>>;
  sourceId: number | null;
  ableToSearchNHSArticle: boolean;
}) => {
  const appSettings = useContext(AppSettingsContext);
  const [activeSource, setActiveSource] = useState("Health A-Z");
  const { NHSMedicines, setNHSMedicines } = useContext(NHSMedicinesContext);
  const { NHSConditions, setNHSConditions } = useContext(NHSConditionsContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (NHSMedicines.length === 0) {
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    if (appSettings) {
      if (NHSMedicines.length == 0 && activeSource == "Medication A-Z") {
        const nhsData = await getNHSData(
          appSettings.meta.collections.nhs_medication_az_api_schema_id
        );
        setLoading(false);
        setNHSMedicines(nhsData);
      } else if (NHSConditions.length == 0 && activeSource == "Health A-Z") {
        const nhsData = await getNHSData(
          appSettings.meta.collections.nhs_health_az_api_schema_id
        );
        setLoading(false);
        setNHSConditions(nhsData);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeSource]);

  return (
    <>
      <SelectOptions
        control={form.control}
        label="Source"
        name={`_source`}
        options={["Health A-Z", "Medication A-Z"]}
        tooltip="Select the Type of source"
        placeholder="Source Type"
        onSelect={(e) => {
          form.setValue(
            "source" as Path<TypeOf<T>>,
            sourceId as PathValue<TypeOf<T>, Path<TypeOf<T>>>,
            {
              shouldValidate: true,
            }
          );
          setActiveSource(e);
        }}
      />
      {ableToSearchNHSArticle && (
        <SelectField
          control={form.control}
          name="article_pc_id"
          label="Search"
          dataKey="name"
          tooltip="Select health topic or medicines"
          placeholder="Select health topic or medicines"
          showLoader={loading}
          options={activeSource == "Health A-Z" ? NHSConditions : NHSMedicines}
          onSelect={(id) => {
            const options =
              activeSource == "Health A-Z" ? NHSConditions : NHSMedicines;
            const selectedNHSData = options.find((i) => i.id == id);
            form.setValue(
              "url" as Path<z.infer<T>>,
              selectedNHSData?.url as PathValue<z.infer<T>, Path<z.infer<T>>>
            );
            form.setValue(
              "title" as Path<z.infer<T>>,
              selectedNHSData?.name as PathValue<z.infer<T>, Path<z.infer<T>>>
            );
            form.setValue(
              "description" as Path<z.infer<T>>,
              selectedNHSData?.description as PathValue<
                z.infer<T>,
                Path<z.infer<T>>
              >
            );
          }}
          required
        />
      )}
    </>
  );
};

export default NHS_SelectField;
