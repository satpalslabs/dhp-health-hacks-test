import { Control, Path, PathValue, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { SelectField } from ".";
import { useContext, useEffect, useState } from "react";
import { AddButton } from "@/components/ui/add-button";
import { Collection, SubSection } from "@/types";
import { CollectionContext } from "@/context/collection-data-provider";
import { SectionContext } from "@/context/section-data-provider";
import { SubSectionContext } from "@/context/sub-section-data-provider";
import AddOrEditSection from "@/components/cms/content-categories/sections/manage-section";
import AddOrEditSubSection from "@/components/cms/content-categories/sub-sections/manage-sub-section";
import AddOrEditCollection from "@/components/cms/content-categories/collections/manage-collection";
import { getSections } from "@/lib/services/section-service";
import { getSubSections } from "@/lib/services/sub-section-service";
import { getCollections } from "@/lib/services/collection-services";

export const GridFields = <T extends z.ZodType>({
  formControl,
  form,
}: {
  formControl: Control<z.infer<z.ZodType>>;
  form: UseFormReturn<z.infer<T>>;
}) => {
  return (
    <div className="w-full grid grid-rows-2 grid-cols-2 gap-4 font-inter">
      <SectionSelectField form={form} formControl={formControl} />
      <SubSectionSelectField form={form} formControl={formControl} />
      <CollectionSelectField form={form} formControl={formControl} />
    </div>
  );
};

export const SectionSelectField = <T extends z.ZodType>({
  formControl,
  form,
  required,
  showAll = false,
}: {
  formControl: Control<z.infer<z.ZodType>>;
  form: UseFormReturn<z.infer<T>>;
  required?: boolean;
  showAll?: boolean;
}) => {
  const [openSection, setOpenSection] = useState(false);
  const { sections, updateSections } = useContext(SectionContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sections.length == 0) {
      getSections().then((res) => {
        updateSections(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <div className="flex gap-[6px]">
      <div className="grow">
        <SelectField
          control={formControl}
          name={"section"}
          label={"Section"}
          tooltip="Select Section"
          dataKey="section_name"
          showLoader={loading}
          required={required}
          placeholder={`Select Section`}
          options={
            showAll
              ? sections
              : sections.filter(
                  (section) => section.section_type == "health hacks"
                )
          }
        />
      </div>
      <AddButton className="mt-7" onClick={() => setOpenSection(true)} />
      <AddOrEditSection
        open={openSection}
        setOpen={setOpenSection}
        handleSubmit={(id: number) => {
          getSections().then((res) => {
            updateSections(res);
            form.setValue(
              "section" as Path<z.infer<T>>,
              id as PathValue<z.infer<T>, Path<z.infer<T>>>
            );
            setLoading(false);
          });
        }}
      />
    </div>
  );
};

export const SubSectionSelectField = <T extends z.ZodType>({
  formControl,
  form,
  showAll,
  required,
}: {
  formControl: Control<z.infer<z.ZodType>>;
  form: UseFormReturn<z.infer<T>>;
  showAll?: boolean;
  required?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const { subSections, updateSubSections } = useContext(SubSectionContext);
  const section = form.watch("section" as Path<z.infer<T>>);
  const [options, setOptions] = useState<SubSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subSections.length == 0) {
      getSubSections().then((res) => {
        updateSubSections(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    setOptions(
      showAll
        ? subSections
        : section
        ? subSections.filter(
            (sub_section) => sub_section.section?.id == section
          )
        : []
    );
  }, [section, subSections]);

  return (
    <div className="flex gap-[6px]">
      <div className="grow">
        <SelectField
          form={form}
          control={formControl}
          name={"sub_section"}
          dataKey="subsection_name"
          label={"Sub Section"}
          tooltip="Select Sub Section"
          placeholder={`Select Sub Section`}
          showLoader={loading}
          options={options}
          required={required}
        />
      </div>
      <AddButton className="mt-7" onClick={() => setOpen(true)} />
      <AddOrEditSubSection
        open={open}
        setOpen={setOpen}
        handleSubmit={(sub_section: number) => {
          setLoading(true);
          getSubSections().then((res) => {
            updateSubSections(res);
            form.setValue(
              "sub_section" as Path<z.infer<T>>,
              sub_section as PathValue<z.infer<T>, Path<z.infer<T>>>
            );
            setLoading(false);
          });
        }}
      />
    </div>
  );
};

const CollectionSelectField = <T extends z.ZodType>({
  formControl,
  form,
}: {
  formControl: Control<z.infer<z.ZodType>>;
  form: UseFormReturn<z.infer<T>>;
}) => {
  const [open, setOpen] = useState(false);
  const { collections, updateCollections } = useContext(CollectionContext);
  const [options, setOptions] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const section = form.watch("section" as Path<z.infer<T>>);
  const subSection = form.watch("sub_section" as Path<z.infer<T>>);

  useEffect(() => {
    if (collections.length == 0) {
      getCollections().then((res) => {
        updateCollections(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setOptions(
      section
        ? subSection
          ? collections.filter(
              (collection) => collection.sub_section?.id == subSection
            )
          : collections.filter(
              (collection) => collection.section?.id == section
            )
        : collections
    );
  }, [section, subSection, collections]);

  return (
    <div className="flex gap-[6px]">
      <div className="grow">
        <SelectField
          form={form}
          control={formControl}
          name={"collection"}
          label={"Collection"}
          dataKey="collection_name"
          tooltip="Select Collection"
          placeholder={`Select Collection`}
          showLoader={loading}
          options={options}
          required
        />
      </div>
      <AddButton className="mt-7" onClick={() => setOpen(true)} />
      <AddOrEditCollection
        open={open}
        setOpen={setOpen}
        handleSubmit={(collection: number) => {
          setLoading(true);
          getCollections().then((res) => {
            updateCollections(res);
            form.setValue(
              "collection" as Path<z.infer<T>>,
              collection as PathValue<z.infer<T>, Path<z.infer<T>>>
            );
            setLoading(false);
          });
        }}
      />
    </div>
  );
};
