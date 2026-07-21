const technologies = [
  {
    title: "Artificial Intelligence",
    description:
      "Building AI-powered solutions that automate processes, generate insights, and create intelligent digital experiences.",
  },
  {
    title: "Software Engineering",
    description:
      "Developing scalable web and mobile applications using modern development frameworks and architectures.",
  },
  {
    title: "Cloud Infrastructure",
    description:
      "Creating secure and reliable digital platforms powered by cloud technologies and modern infrastructure.",
  },
  {
    title: "Data & Automation",
    description:
      "Transforming business operations through data-driven solutions, automation, and intelligent workflows.",
  },
];

export default function TechnologySection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-[#0b2347]">
            Technology That Powers Innovation
          </h2>

          <p className="mt-4 text-lg text-gray-600">
            Combining software engineering, artificial intelligence, and
            modern infrastructure to build scalable digital solutions.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {technologies.map((technology) => (
            <div
              key={technology.title}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-[#1e5aa8]">
                {technology.title}
              </h3>

              <p className="mt-3 text-gray-600">
                {technology.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}