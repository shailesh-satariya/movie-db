import React from "react";
import {Link} from "react-router-dom";
import moment from "moment";
import {Form} from "./form";
import {Movie} from "../types/graphql/movie";

const Joi = require("joi-browser");

interface MovieFormProps {
    data?: Movie | null;
    saveMovie: (movie: Movie) => void;
}

interface MovieFormState {
    data: Movie | null;
    errors: Record<string, any>;
    loading: boolean;
}

const newMovie: Movie = {releaseDate: moment().format('YYYY-MM-DD'), title: '', duration: 0, __typename: "Movie"};

/**
 * MovieForm component
 */
class MovieForm extends Form<MovieFormProps, MovieFormState> {
    schema: Record<string, any> = {
        _id: Joi.string(),
        title: Joi.string()
            .required()
            .label("Name"),
        releaseDate: Joi.string()
            .required()
            .label("Release date"),
        duration: Joi.number()
            .required()
            .label("Duration"),
    };
    props: MovieFormProps;
    state: MovieFormState = {
        data: newMovie,
        errors: {},
        loading: true
    };

    /**
     * Constructor
     *
     * @param {TableHeaderProps} props
     */
    constructor(props: MovieFormProps) {
        super(props);
        this.props = props;

        if (props.data) {
            this.state.data = props.data;
        }
    }

    /**
     * On form submit
     */
    doSubmit = async (): Promise<void> => {
        if (this.state.data) {
            await this.props.saveMovie(this.state.data);
        }
    };

    /**
     * renders cancel button
     *
     * @return JSX.Element
     */
    renderCancelButton = (): JSX.Element => {
        return (
            <Link className="text-decoration-none" to="/movies">
                <button className="btn btn-light ml-2">Cancel</button>
            </Link>
        );
    };

    render(): JSX.Element | null {
        const {data}: MovieFormProps = this.props;

        return (
            <div>
                <h1>
                    {data?._id ? ('Edit movie: ' + data.title) : 'Add movie'}
                </h1>
                <form onSubmit={this.handleSubmit}>
                    {this.renderInput("title", "Title")}
                    {this.renderDurationFiled("duration", "Duration")}
                    {this.renderDatePicker("releaseDate", "Release date")}
                    {this.renderSubmitButton("Save")}
                    {this.renderCancelButton()}
                </form>
            </div>
        );
    }
}

export default MovieForm;
