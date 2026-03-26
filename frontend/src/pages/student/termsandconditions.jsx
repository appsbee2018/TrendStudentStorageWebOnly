/**
 * @author Tyler Marois
 * @description The students terms and conditions page
 */
import React from "react";

const TermsAndConditions = () => {

    return (
        <div className="w-full h-full mx-10 mb-10 overflow-y-auto">
            <div className="w-full my-10 border-b-2 border-black border-opacity-20">
                <h1 className=" font-hind font-semibold text-5xl text-primary">Terms and Conditions</h1>
            </div>

            <div className="px-10 py-5 overflow-auto bg-background-100">
                <ol className="list-decimal gap-5 flex flex-col text-justify">
                    <li>
                        Trend Moving & Storage Is Not Responsible for moving/transporting/packing any Liquids, Liquors, Aerosols, Combustibles or Flammables. All gas needs to be drained from any items before they can be moved. In the event that any items above are moved or put into boxes to be moved, Trend Moving & Storage will hold the acting party responsible for any losses or damages that occur to any and all affected shipments.
                    </li>

                    <li>
                        Trend Moving & Storage will not hold any liability for any damaged or missing items within any
                        boxes, unless it is clear that the box has been compromised or been subject to apparent structural
                        damage within the possession of Trend Moving & Storage. Each student, faculty, or staff member is
                        responsible for properly sealing and packing their boxes before dropping off at Harvard Student
                        Agencies designated areas. In the event that a box appears to have been opened, compromised, or
                        received structural damage under Trend Moving & Storage's possession the student, faculty, or staff
                        member is responsible to show either a Harvard Student Agencies or Trend Moving & Storage
                        representative immediately on delivery day for further examination. All properly sealed boxes that are
                        compromised under the possession of Trend Moving & Storage will be the responsibility of Trend
                        Moving & Storage to remedy with the student, faculty, or staff member.

                        <p className="text-lg text-justify mt-10 underline" >
                            These items include but are not limited to:
                        </p>

                        <ol className="list-disc gap-2 flex flex-col pl-10">
                            <li>Lamps</li>
                            <li>Lamp Shades</li>
                            <li>Light Bulbs</li>
                            <li>Musical Instruments</li>
                            <li>Glass</li>
                            <li>Ceramics</li>
                            <li>Fragile Materials</li>
                            <li>Dishware</li>
                            <li>TVs</li>
                            <li>Computers</li>
                            <li>All other breakable items</li>
                        </ol>
                    </li>

                    <li>
                        All boxes must be sealed and boxed in accordance to Trend Moving & Storages proper packing and
                        boxing etiquette shown in “Packing Tips”. Boxes not packed under the proper etiquette can be
                        deemed void of any liability protection.
                    </li>

                    <li>
                        Trend Moving & Storage will not be responsible for any jewelry, documents, or items of “high value”
                        in excess of $100 per pound. The customer/shipper will be responsible for moving all the items in
                        this category.
                    </li>

                    <li>
                        No firearms or ammunition will be moved or handled by Trend Moving & Storage.
                    </li>

                    <li>
                        Trend Moving & Storage will not be responsible for the transportation of any plants or other living
                        vegetation. 
                    </li>

                    <li>
                        All claims must be filed within 10 business days of the delivered goods in writing to Trend Moving &
                        Storage at <a className="underline" href="mailto:remedy@trendmoving.com">remedy@trendmoving.com</a>. After receipt of the claim, Trend Moving & Storage will have
                        10 business days to issue a reply. In the event that Trend Moving & Storage is found at fault for the
                        claim. Under Full Value Protection, Trend Moving & Storage will do one of the following actions of
                        their choosing:

                        <ol className="list-disc gap-2 flex flex-col pl-10 mt-3">
                            <li>Repair the item to a satisfactory level.</li>
                            <li>Replace with a similar item.</li>
                            <li>Make a cash settlement for the cost of repair or the current market replacement value with a value no
                                higher than $240.</li>
                        </ol>
                    </li>

                    <li>
                        This Agreement shall be interpreted, construed, and governed according to the laws of the State of
                        New Hampshire. The customer acknowledges that any court action relating to this Agreement shall
                        only be conducted in the State of New Hampshires' state courts or Federal Courts.
                    </li>
                </ol>
            </div>
        </div>
    )
}

export default TermsAndConditions;