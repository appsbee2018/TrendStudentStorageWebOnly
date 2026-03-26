/**
 * @author Tyler Marois
 * @description A page showing packing tips to students
 */
import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBoxArchive, faTape, faWineGlassEmpty, faScaleBalanced, faBoxesStacked, faTags } from "@fortawesome/free-solid-svg-icons";

const PackingTips = () => {


    return (
        <div className="flex flex-col gap-5 w-full flex-grow pt-5 p-10 h-full justify-center items-center">
            <div className='flex items-center justify-center my-10 w-[60%] flex-col' >
                <div className="w-full items-center justify-center flex flex-col my-10 gap-5">
                    <h1 className="text-6xl text-primary font-hind font-semibold">Packing Tips</h1>
                    <h2 className="text-2xl">Everything you can to do to ensure the safety of your items!</h2>
                </div>

                <iframe
                    className="border-2 border-primary shadow-lg rounded-md w-3/4 aspect-video m-5"
                    src="https://drive.google.com/file/d/1kvfhKDo9E8lrxVY_IcLKyKCWrJ2qXxzB/preview"
                    allow="autoplay"
                ></iframe>

                <p className="text-lg text-justify font-sans" >
                    When it comes to shipping items, efficient box packing can make all the difference. Properly packed boxes not only ensure the safety of your goods during transit but also help you optimize shipping costs. Here are some essential tips to help you pack your boxes effectively.
                </p>

                <div className="gap-10 flex flex-col my-5 mx-10">
                    <div className={"flex justify-end items-center gap-10 "}>
                        <h2><strong className="text-primary text-2xl font-hind">Choose the Right Box:</strong> Select a box that is sturdy enough to withstand the weight of your items. Avoid using oversized boxes as they can lead to wasted space and increased shipping costs. Opt for boxes that are just the right size for your items to minimize movement during transit. We recommend using only the moving rated boxes provided by your student storage contact.</h2>
                        <FontAwesomeIcon className="size-[100px] text-primary" icon={faBoxArchive} />
                    </div>

                    <div className={"flex justify-end items-center gap-10  "}>
                        <FontAwesomeIcon className="size-[100px] text-primary" icon={faTape} />
                        <h2 className="text-right"><strong className="text-primary text-2xl font-hind">Use Quality Packing Materials:</strong> Invest in high-quality packing materials such as bubble wrap, packing peanuts, and sturdy tape. These materials provide cushioning and protection to your items, reducing the risk of damage during shipping. Avoid using old or damaged packing materials as they may not provide adequate protection. Trend Moving & Storage can provide you with the best means of packing materials.</h2>
                    </div>

                    <div className={"flex justify-end items-center gap-10 "}>
                        <h2><strong className="text-primary text-2xl font-hind">Wrap Fragile Items Securely:</strong> For fragile items such as glassware or electronics, wrap them individually in bubble wrap or foam padding. Place these items in the center of the box and fill any empty spaces with packing peanuts or crumpled paper to prevent them from shifting during transit. Label the box as "Fragile" to alert handlers to handle it with care.</h2>
                        <FontAwesomeIcon className="size-[100px] text-primary" icon={faWineGlassEmpty} />
                    </div>

                    <div className={"flex justify-end items-center gap-10 "}>
                        <FontAwesomeIcon className="size-[100px] text-primary" icon={faScaleBalanced} />
                        <h2 className="text-right "><strong className="text-primary text-2xl font-hind">Distribute Weight Evenly:</strong> Distribute the weight of your items evenly across the box to prevent it from becoming top-heavy or lopsided. Place heavier items at the bottom and lighter items on top. This helps maintain the stability of the box and reduces the risk of it tipping over during transit.</h2>
                    </div>

                    <div className={"flex justify-end items-center gap-10 "}>
                        <h2><strong className="text-primary text-2xl font-hind">Seal Boxes Properly:</strong> Once you have packed your items, seal the box securely with strong packing tape. Reinforce the seams and corners of the box to prevent it from opening during transit. Use clear tape so that any shipping labels or barcodes are clearly visible.</h2>
                        <FontAwesomeIcon className="size-[100px] text-primary" icon={faBoxesStacked} />
                    </div>

                    <div className={"flex justify-end items-center gap-10 "}>
                        <FontAwesomeIcon className="size-[100px] text-primary" icon={faTags} />
                        <h2 className="text-right"><strong className="text-primary text-2xl font-hind">Label Boxes Clearly:</strong> Label each box with the recipient's address, your return address, and any special handling instructions such as "Fragile" or "This Side Up." This ensures that your package reaches its destination safely and quickly. Use a permanent marker or adhesive labels for clear and legible labeling.</h2>
                    </div>
                </div>

                <p className="text-lg text-justify">
                    By following these tips, you can minimize the risk of damage during transit and streamline the shipping process for both you and your customers. Happy packing!
                </p>
            </div>
        </div>
    )
}

export default PackingTips;