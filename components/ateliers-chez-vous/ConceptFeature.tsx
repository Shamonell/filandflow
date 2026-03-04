interface ConceptFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function ConceptFeature({
  icon,
  title,
  description,
}: ConceptFeatureProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-[#EEF4EE] text-[#6F8F72] md:h-32 md:w-32">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-medium text-[#5C3A21] md:text-2xl">{title}</h3>
      <p className="text-base leading-relaxed text-[#5F6C72] md:text-lg">{description}</p>
    </div>
  );
}


