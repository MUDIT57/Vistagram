import React from "react";

type InputProps = {
  text: string;
  value: string;
  placeholder: string;
  isRequired: boolean;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  onIconClick?: () => void;
};

export const CustomInput = (inputProps: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-label">{inputProps.text}</span>
      <div className="flex border border-border bg-surface-muted/50 rounded-lg items-center">
        {inputProps.leftIcon && (
          <div className="text-placeholder pl-4">{inputProps.leftIcon}</div>
        )}
        <input
          type={inputProps.type}
          required={inputProps.isRequired}
          value={inputProps.value}
          onChange={inputProps.onChange}
          placeholder={inputProps.placeholder}
          className="w-full border-none placeholder:text-placeholder text-foreground border rounded-lg p-3 px-4 focus:outline-none"
        />
        <div>
          {inputProps.rightIcon && (
            <div onClick={inputProps.onIconClick} className="pr-4 text-placeholder">
              {inputProps.rightIcon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
