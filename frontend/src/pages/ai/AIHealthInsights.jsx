import { Activity, ArrowRight, HeartPulse, ShieldAlert, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";

const insights = [
    {
        title: "Health Summary",
        description: "Organize recorded health information into an emergency-focused summary.",
        route: "/ai-health-summary",
        icon: HeartPulse,
        tone: "bg-purple-50 text-purple-700",
    },
    {
        title: "Risk Analysis",
        description: "Review rule-based risk factors from your saved emergency profile.",
        route: "/ai/emergency-risk",
        icon: Activity,
        tone: "bg-amber-50 text-amber-700",
    },
    {
        title: "Emergency Guidance",
        description: "View profile-based precautions and emergency decision-support guidance.",
        route: "/ai/emergency-guidance",
        icon: ShieldAlert,
        tone: "bg-blue-50 text-blue-700",
    },
];

const AIHealthInsights = () => {
    const navigate = useNavigate();

    return (
        <AppLayout title="AI Health Insights">
            <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-8">
                <div className="flex max-w-3xl gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-400/15 text-purple-200">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-purple-200">Rule-based decision support</p>
                        <h2 className="mt-2 text-3xl font-bold">Health insights for emergency preparedness</h2>
                        <p className="mt-3 text-sm leading-6 text-slate-300 md:text-base">
                            These tools use the health information you recorded to organize emergency-relevant details. They support—not replace—professional medical assessment.
                        </p>
                    </div>
                </div>
            </section>

            <section className="mt-6 grid gap-5 lg:grid-cols-3">
                {insights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                        <article key={insight.route} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${insight.tone}`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <h3 className="mt-5 text-lg font-semibold text-slate-900">{insight.title}</h3>
                            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{insight.description}</p>
                            <button
                                type="button"
                                onClick={() => navigate(insight.route)}
                                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-800 hover:text-teal-950"
                            >
                                Open {insight.title}
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </article>
                    );
                })}
            </section>
        </AppLayout>
    );
};

export default AIHealthInsights;
