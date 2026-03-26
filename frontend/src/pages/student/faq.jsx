/**
 * @author Tyler Marois
 * @description The FAQ page for the trend student storage website
 */
import React, { useState } from "react";

const FAQ = () => {
    const faqs = [
        {
            question: "How do I get the supplies for packing my items?",
            answer: "Any boxes or packing materials will be provided by either the university point of contact for student storage or a Trend Moving & Storage consultant depending on your university's custom storage plan."
        },
        {
            question: "How do I pay for my storage services?",
            answer: "Payment will be collected by your Student Storage point of contact within the payment deadlines explained in the Terms & Conditions. Any items not provided by the HSA will be billed accordingly and payment will be collected over the course of the summer."
        },
        {
            question: "What items cannot be stored at Trend Moving & Storage?",
            answer: "Trend Moving & Storage is not responsible for moving/transporting/packing any live vegetation, liquids, liquors, aerosols, combustibles, or flammables. All gas needs to be drained from any items before they can be moved or stored."
        },
        {
            question: "I live off campus, can you still pick up and deliver my belongings?",
            answer: "We are happy to help students that live off campus. If associated with universities that are set up in our Student Storage platform we can honor the discounted student storage rates however this may warrant additional cost in terms of labor and delivery. Pick up and delivery services for off campus housing would be coordinated by calling into our direct office line at 855-509-6683."
        },
        {
            question: "I am returning to campus earlier than most students, can my items be delivered earlier?",
            answer: "This may vary depending on the university with which you are associated. If service is needed outside of the standard scheduled pick up and delivery times this may warrant additional cost."
        },
        {
            question: "Can I store my belongings for longer than the summer?",
            answer: "You are welcome to store items longer than the duration of your summer break. Any time spent in storage outside of would be charged on a month by month basis and the coordination of delivering your items outside of the standard scheduled delivery window may warrant additional cost."
        },
        {
            question: "Do I have to be present during pick up and delivery?",
            answer: "You must be in contact with a Student Storage representative or Trend Moving & Storage representative at the site of box pick up prior to leaving your items. Delivery will be coordinated to be dropped off during the scheduled delivery time and is the responsibility of the registered student to secure their own belongings."
        }
    ];
    


    return (
        <div className="flex flex-col gap-5 w-full flex-grow pt-5 p-10 h-full justify-center items-center">
            <h1 className="mt-20 text-primary text-7xl text-center font-hind">Frequently Asked Questions</h1>

            <div className="flex w-[90%] justify-center items-center my-20 px-20">
                <div className="grid grid-cols-1 row-auto w-[60%]">
                    {faqs.map((faq, index) => {
                        return (
                            <FAQItem key={index} question={faq.question} answer={faq.answer}  />
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

const FAQItem = ({ question, answer}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    return (
        <>
            <div className="flex items-center justify-between px-2 gap-5 py-5 drop-shadow-2xl bg-primary bg-opacity-10" onClick={() => setIsExpanded(!isExpanded)}>
                <h2 className="text-xl font-hind font-semibold">{question}</h2>
                <div className="flex items-center justify-center cursor-pointer" >
                    <span className="bg-primary w-[16px] h-[6px] flex"></span>
                    <span className={"bg-primary w-[16px] h-[6px] flex absolute duration-200 " + (isExpanded ? "rotate-0" : "rotate-90")}></span>
                </div>
            </div>

            <div className={"items-start justify-start bg-primary bg-opacity-15 py-2 w-full overflow-hidden  duration-300 border-b-primary border-2 " + (isExpanded ? "h-full opacity-100" : "h-0 bg-opacity-10")}>
                <p className={"px-5 text-lg " + (isExpanded ? "opacity-100" : "opacity-0")} >{answer}</p>
            </div>

            <span className="flex mb-5"></span>
        </>
    )
}

export default FAQ;