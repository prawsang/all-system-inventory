import React from "react";
import { dashedDate } from "@/common/date";
import moment from "moment";
import FetchDataFromServer from "@/common/components/FetchDataFromServer";
import { Date } from "@/common/filters/form";
import Td from "@/common/components/Td";

class IncomeReport extends React.Component {
    state = {
        from: moment().startOf("month").format('YYYY-MM-DD'),
        to: moment().endOf("month").format('YYYY-MM-DD'),
    }

    render() {
        console.log(this.state);
        const { from, to } = this.state;
        return (
            <React.Fragment>
                <h3>Income Report</h3>
                <div className="panel">
                    <div className="panel-content">
                        <div className="is-flex is-ai-center has-mb-10">
                            <Date
                                label="Range"
                                fromValue={from} 
                                fromOnChange={e => this.setState({ from: e.target.value})} 
                                toValue={to}
                                toOnChange={e => this.setState({ to: e.target.value})} 
                            />
                        </div>
                        <br/>
                        <FetchDataFromServer
                            url="/report/cost-report"
                            params={from&&to ? `from=${dashedDate(from)}&to=${dashedDate(to)}` : ""}
                            render={d => (
                                <div className="is-flex">
                                    <div className="col col-6">
                                        <h5>
                                            <span className="is-normal">Total Cost: <br/></span>
                                            <b>{ d && Number(d.row.in_cost).toLocaleString()} THB</b>
                                        </h5>
                                    </div>
                                    <div className="col col-6">
                                        <h5>
                                            <span className="is-normal">Total Income: <br/></span>
                                            <b>{ d && Number(d.row.out_cost).toLocaleString()} THB</b>
                                        </h5>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                    <div className="panel-content">
                        <h5 className="no-mb">Top Customers</h5>
                    </div>
                        <FetchDataFromServer
                            url="/report/top-customers"
                            params={from&&to ? `from=${dashedDate(from)}&to=${dashedDate(to)}` : ""}
                            render={d => (
                                <table className="is-fullwidth is-rounded">
                                    <thead>
                                        <tr>
                                            <td>Customer Code</td>
                                            <td>Customer Name</td>
                                            <td>Total Income</td>
                                        </tr>
                                    </thead>
                                    <tbody className="is-hoverable">
                                        {d &&
                                            (d.rows.length > 0 &&
                                                d.rows.map((e, i) => (
                                                    <tr
                                                        className="is-hoverable is-clickable"
                                                        key={i + e.customer_code}
                                                    >
                                                        <Td to={`/single/customer/${e.customer_code}`}>{e.customer_code}</Td>
                                                        <Td to={`/single/customer/${e.customer_code}`}>{e.customer_name}</Td>
                                                        <Td>{Number(e.sum).toLocaleString()}</Td>
                                                    </tr>
                                                )))}
                                    </tbody>
                                </table>
                            )}
                        />
                    </div>
            </React.Fragment>
        )
    }
}

export default IncomeReport;