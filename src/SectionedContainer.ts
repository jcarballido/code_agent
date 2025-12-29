import React from 'react';

interface SectionedContainerProps {
  section1Color: string;
  section2Color: string;
  section3Color: string;
}

const SectionedContainer: React.FC<SectionedContainerProps> = ({
  section1Color,
  section2Color,
  section3Color,
}) => (
  <div className="flex flex-1">
    <section className={`bg-${section1Color} flex-1`}></section>
    <section className={`bg-${section2Color} flex-1`}></section>
    <section className={`bg-${section3Color} flex-1`}></section>
  </div>
);

export default SectionedContainer;