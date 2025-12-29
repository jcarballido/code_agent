import React from 'react';

interface FormContainerComponentProps {
  formProps: React.ReactNode;
}

const FormContainerComponent: React.FC<FormContainerComponentProps> = ({ formProps }) => (
  <div className="flex flex-col min-h-screen">
    <h1 className="text-2xl font-bold text-center mb-4">Form Title</h1>
    <form className="flex-1 p-4 border border-gray-300 rounded-lg">
      {formProps}
    </form>
    <p className="text-right px-4 pb-4">Additional text below the form</p>
  </div>
);

export default FormContainerComponent;