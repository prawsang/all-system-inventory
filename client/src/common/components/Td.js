import React from "react";
import { Link } from "react-router-dom";

const Td = ({ to, className,children, style }) => (
    to ? (
        <td>
            <Link to={to} className={className} style={style}>
                {children}
            </Link>
        </td>
    ) : (
        <td className={`${className} no-link`} style={style}>
            {children}
        </td>
    )
)

export default Td;