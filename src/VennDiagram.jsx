import interact from "interactjs";
import { useEffect, useRef } from "react";
export default function VennDiagram(){
    const circleRef = useRef(null);
    useEffect(() => {
        if(!circleRef.current) return;
        interact(circleRef.current).draggable({
            listeners:{
                move(event){
                    const target = event.target; //DOM element being dragged
                    //read current drag offset
                    const x = (parseFloat(target.getAttribute("data-x")) || "0") + event.dx;
                    const y = (parseFloat(target.getAttribute("data-y")) || "0") + event.dy;
                    //update DOM position with SVG (cx/cy are absolute coordinates)
                    target.setAttribute("cx", String(x + 100))
                    target.setAttribute("cy", String(y + 100))
                    //update drag offset in prep for next event
                    target.setAttribute("data-x", String(x))
                    target.setAttribute("data-y", String(y))

                }
            }
        })

    }, []);
    return(
        <svg width={800} height={500} className=" border-red-600 border-2">
            {/* Drop Zone */}
            <circle 
                cx={100} 
                cy={100} 
                r={50} 
                fill="red"
                stroke="green"
                opacity={0.5}
                
                ref={circleRef}

            />
        </svg>
    );
};