import React from "react";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import Moon from "@/moon-01.svg";
import { Sun } from "lucide-react";

const SwitchTheme = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  return (
    <Tabs
      defaultValue={theme}
      value={theme}
      className="w-full"
      onValueChange={setTheme}
    >
      <TabsList className="w-full p-1 rounded-xl gap-1 px-1">
        <TabsTrigger value="light" className="w-1/2 rounded-lg ">
          <Sun className="w-6 h-6" />
        </TabsTrigger>
        <TabsTrigger value="dark" className="w-1/2 rounded-lg">
          <Moon className="w-6 h-6" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SwitchTheme;
