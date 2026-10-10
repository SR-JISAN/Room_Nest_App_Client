"use client";

import { useForm } from "@tanstack/react-form";
import { motion, useReducedMotion } from "framer-motion";
import {
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

const faqs = [
  {
    q: "How does booking a room work on Room Nest?",
    a: "Browse verified listings, review room amenities and pricing, select your move-in date, and submit a booking request. You'll receive instant confirmation upon securing your deposit via bKash.",
  },
  {
    q: "How are security deposits protected?",
    a: "All security deposits are tracked through our automated payment verification gateway and documented with clear digital invoices for both tenants and landlords.",
  },
  {
    q: "Can I find or list shared rooms with roommates?",
    a: "Yes! Room Nest features roommate matching for shared rooms and sublets, allowing primary tenants to review roommate applicants before accepting requests.",
  },
  {
    q: "How can landlords list their properties?",
    a: "Register as a Landlord or switch your role, navigate to 'Add a Property', upload photos, add room options, and submit for verification. Our team reviews submissions promptly.",
  },
];

export default function ContactPage() {
  const shouldReduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = contactSchema.safeParse(value);
      if (!parsed.success) {
        toast.add({
          title: "Form Error",
          description:
            parsed.error.issues[0]?.message ?? "Please check form values.",
          type: "error",
        });
        return;
      }

      setSubmitted(true);
      toast.add({
        title: "Message Sent",
        description:
          "Thank you for reaching out! Our team will respond shortly.",
        type: "success",
      });
      form.reset();
    },
  });

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" as const },
      };

  return (
    <main className="min-h-screen bg-[#f7faf7] text-[#14251b]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#0f1f17] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#9bd5a8]/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 left-1/4 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            {...motionProps}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-emerald-200">
              <Sparkles className="h-3.5 w-3.5" />
              We are here to help
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Get in Touch with{" "}
              <span className="text-[#a8e6b5]">Room Nest</span>
            </h1>

            <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
              Have questions about renting, listing a property, or finding a
              roommate? Reach out to our support team and we will get back to
              you promptly.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards & Form */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="space-y-6 lg:col-span-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#345840]">
                Contact Information
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[#14251b]">
                Let us assist your journey
              </h2>
              <p className="mt-2 text-sm text-[#5a6e60]">
                Feel free to email us, call our office, or submit an inquiry
                using the form.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="rounded-2xl border-[#e2eae3] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf5ed] text-[#2d5839]">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#14251b]">Headquarters</h3>
                    <p className="mt-1 text-sm text-[#5a6e60]">
                      Dhaka, Bangladesh
                    </p>
                    <p className="text-xs text-[#7d9083]">
                      Central operations and landlord support center
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-[#e2eae3] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf5ed] text-[#2d5839]">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#14251b]">Email Support</h3>
                    <p className="mt-1 text-sm text-[#5a6e60]">
                      support@roomnest.com
                    </p>
                    <p className="text-xs text-[#7d9083]">
                      Typical response time within 24 hours
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-[#e2eae3] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf5ed] text-[#2d5839]">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#14251b]">Direct Phone</h3>
                    <p className="mt-1 text-sm text-[#5a6e60]">
                      +880 1700-000000
                    </p>
                    <p className="text-xs text-[#7d9083]">
                      Available Sunday – Thursday, 9:00 AM – 6:00 PM
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl border-[#e2eae3] bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#edf5ed] text-[#2d5839]">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#14251b]">Office Hours</h3>
                    <p className="mt-1 text-sm text-[#5a6e60]">
                      Sunday – Thursday: 9:00 AM – 6:00 PM
                    </p>
                    <p className="text-xs text-[#7d9083]">
                      Friday & Saturday: Emergency inquiries only
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <Card className="rounded-3xl border-[#e0e8df] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#345840]">
                  Send a Message
                </p>
                <h3 className="mt-1 text-xl font-bold text-[#14251b]">
                  How can we assist you?
                </h3>
              </div>

              {submitted ? (
                <div className="rounded-2xl bg-[#edf5ed] p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#173b28] text-white">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-[#173b28]">
                    Inquiry Received
                  </h4>
                  <p className="mt-2 text-sm text-[#5a6e60]">
                    Thank you for reaching out. One of our support specialists
                    will get in touch with you shortly.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 rounded-xl bg-[#173b28] hover:bg-[#245638]"
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <form.Field name="name">
                      {(field) => (
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-xs font-semibold text-[#34483a]"
                          >
                            Full Name *
                          </label>
                          <Input
                            id="name"
                            placeholder="Your Name"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mt-1.5 h-11 rounded-xl border-[#dbe4dc]"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="email">
                      {(field) => (
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-xs font-semibold text-[#34483a]"
                          >
                            Email Address *
                          </label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mt-1.5 h-11 rounded-xl border-[#dbe4dc]"
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <form.Field name="phone">
                      {(field) => (
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-xs font-semibold text-[#34483a]"
                          >
                            Phone Number (Optional)
                          </label>
                          <Input
                            id="phone"
                            placeholder="01XXXXXXXXX"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mt-1.5 h-11 rounded-xl border-[#dbe4dc]"
                          />
                        </div>
                      )}
                    </form.Field>

                    <form.Field name="subject">
                      {(field) => (
                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-xs font-semibold text-[#34483a]"
                          >
                            Subject *
                          </label>
                          <Input
                            id="subject"
                            placeholder="Rental Inquiry / Verification / Help"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="mt-1.5 h-11 rounded-xl border-[#dbe4dc]"
                          />
                        </div>
                      )}
                    </form.Field>
                  </div>

                  <form.Field name="message">
                    {(field) => (
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-xs font-semibold text-[#34483a]"
                        >
                          Message *
                        </label>
                        <textarea
                          id="message"
                          rows={4}
                          placeholder="Tell us what you need assistance with..."
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="mt-1.5 w-full rounded-xl border border-[#dbe4dc] bg-white p-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                        />
                      </div>
                    )}
                  </form.Field>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-[#173b28] font-semibold text-white hover:bg-[#245638]"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Submit Inquiry
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="border-t border-[#e2eae3] bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#edf5ed] px-3.5 py-1.5 text-xs font-bold text-[#2a5537]">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              Common questions about Room Nest
            </h2>
            <p className="mt-2 text-sm text-[#5a6e60]">
              Everything you need to know about properties, booking, and
              security.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <Card
                key={faq.q}
                className="rounded-2xl border-[#e2eae3] bg-[#f9fbf9] p-5 shadow-xs"
              >
                <h3 className="text-base font-bold text-[#14251b]">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5a6e60]">
                  {faq.a}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
