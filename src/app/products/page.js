
import PublicLayout from "@/components/PublicLayout";

const products = [
    {
        icon: "fa-solid fa-ship",
        name: "Rescue Boats",
        category: "Rescue Equipment",
        description: "Boats used by rescue teams to reach and evacuate people from flooded locations.",
    },
    {
        icon: "fa-solid fa-life-ring",
        name: "Life Jackets",
        category: "Safety Equipment",
        description: "Personal flotation equipment designed to support water safety during rescue operations.",
    },
    {
        icon: "fa-solid fa-kit-medical",
        name: "Medical Kits",
        category: "Medical Supplies",
        description: "Essential medical supplies for providing basic first aid during emergency response.",
    },
    {
        icon: "fa-solid fa-bottle-water",
        name: "Drinking Water",
        category: "Relief Supplies",
        description: "Safe drinking water supplies for people affected by floods.",
    },
    {
        icon: "fa-solid fa-bowl-food",
        name: "Food Supplies",
        category: "Relief Supplies",
        description: "Food packets and essential nutrition supplies for displaced families.",
    },
    {
        icon: "fa-solid fa-blanket",
        name: "Blankets and Clothing",
        category: "Relief Supplies",
        description: "Basic clothing and blankets to support people during emergency displacement.",
    },
    {
        icon: "fa-solid fa-flashlight",
        name: "Flashlights and Batteries",
        category: "Emergency Equipment",
        description: "Lighting equipment that can help rescue teams operate in low-light conditions.",
    },
    {
        icon: "fa-solid fa-wind",
        name: "Oxygen Cylinders",
        category: "Medical Equipment",
        description: "Oxygen equipment for situations requiring respiratory support by trained personnel.",
    },
];

export default function Products() {
    return (
        <PublicLayout>
            <section className="bg-slate-900 text-white text-center py-20 px-6">
                <p className="text-cyan-400 uppercase tracking-widest font-bold text-sm">
                    Rescue Resources
                </p>
                <h1 className="text-4xl md:text-5xl font-extrabold mt-4">
                    Equipment That Supports Every Rescue
                </h1>
                <p className="max-w-2xl mx-auto mt-5 text-gray-300 leading-7">
                    Explore essential equipment and supplies used in
                    flood-response and relief coordination.
                </p>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.name}
                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 border border-gray-100"
                        >
                            <div className="h-36 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                                <i className={`${product.icon} text-6xl text-cyan-700`}></i>
                            </div>

                            <p className="text-xs font-bold uppercase tracking-wide text-cyan-700 mt-5">
                                {product.category}
                            </p>

                            <h2 className="text-lg font-bold text-slate-900 mt-2">
                                {product.name}
                            </h2>

                            <p className="text-sm text-gray-600 mt-3 leading-6">
                                {product.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-6 pb-20">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
                    <i className="fa-solid fa-boxes-stacked text-4xl text-blue-600"></i>
                    <h2 className="text-2xl font-bold text-slate-900 mt-4">
                        Resource Management
                    </h2>
                    <p className="text-gray-600 mt-3 leading-7">
                        FRS supports resource tracking so that rescue teams
                        can monitor their assigned supplies and available stock.
                    </p>
                </div>
            </section>
        </PublicLayout>
    );
}
