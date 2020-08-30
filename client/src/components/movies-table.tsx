import React, {Component, Fragment} from "react";
import {Link} from 'react-router-dom';
import {StarRating, Table} from "./common";
import {Column} from "../types";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';
import auth from "../services/auth-service";
import moment from "moment";
import {convertMinutesToDuration} from "../utils/helper";
import {Movie} from "../types/graphql/movie";

interface MoviesTableProps {
    movies: Movie[];
    selectedMovie: Movie | null,
    sort: string;
    onDelete: (movie: Movie) => void;
    onSort: (sort: string) => void;
    onRate: (movie: Movie, score: number) => void;
}

interface MoviesTableState {
    rateButton: HTMLButtonElement | null,
    rateMovie: Movie | null;
    deleteMovie: Movie | null;
}

/**
 * MoviesTable component
 */
class MoviesTable extends Component<MoviesTableProps, MoviesTableState> {
    columns: Column[] = [
        {
            path: "title",
            label: "Title",
            sortable: true
        },
        {
            path: "duration",
            label: "Duration",
            sortable: true,
            content: (movie: Movie): string => {
                const [hours, minutes] = convertMinutesToDuration(movie.duration);

                return `${hours}h ${minutes}min`;
            }
        },
        {
            path: "releaseDate",
            label: "Release date",
            content: (movie: Movie): string => {

                return moment(movie.releaseDate).format('DD MMMM YYYY');
            },
            sortable: true
        },
        {
            path: "rating",
            label: "Rating",
            defaultOrder: 'desc',
            content: (movie: Movie): JSX.Element | null => {
                if (!movie.rating) {
                    return <span>N/A</span>;
                }

                const rating: string = (movie.rating).toFixed(1);

                return <span>{rating} / 5</span>;
            },
            sortable: true
        }
    ];
    state: MoviesTableState = {
        deleteMovie: null,
        rateMovie: null,
        rateButton: null
    }
    props: MoviesTableProps;

    /**
     * Constructor
     *
     * @param {MoviesTableProps} props
     */
    constructor(props: MoviesTableProps) {
        super(props);
        this.props = props;

        const user = auth.getCurrentUser();

        if (user) {
            this.columns.push(this.buttonColumn);
        }
    }

    /**
     * Sets movie to be deleted
     *
     * @param deleteMovie
     */
    setDeleteMovie(deleteMovie: Movie | null): void {
        this.setState({deleteMovie});
    };

    /**
     * Sets movie to be deleted
     *
     * @param event MouseEvent
     * @param rateMovie Movie
     *
     */
    setRateMovie = (event: React.MouseEvent<HTMLButtonElement>, rateMovie: Movie | null): void => {
        this.setState({rateMovie, rateButton: event.currentTarget});
    };

    buttonColumn: Column = {
        path: "options", label: "Options",
        content: (movie: Movie): JSX.Element => {
            return (
                <Fragment>
                    <button className="btn btn-primary btn-sm mt-1 mr-1"
                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => this.setRateMovie(event, movie)}>Rate
                    </button>

                    {
                        auth.canEdit(movie) ?
                            <Fragment>
                                <Link to={`/movies/${movie._id}`} className="text-white text-decoration-none">
                                    <button className="btn btn-success btn-sm mr-1 mt-1" type="button">
                                        Edit
                                    </button>
                                </Link>
                                <button className="btn btn-danger btn-sm mt-1"
                                        onClick={() => this.setDeleteMovie(movie)}>Delete
                                </button>
                            </Fragment>
                            : null
                    }

                </Fragment>
            );
        }
    };

    /**
     * unsets movie to be deleted
     */
    unsetRateMovie = (): void => {
        this.setState({rateMovie: null, rateButton: null});
    };

    /**
     * Sets movie to be deleted
     *
     * @param movie Movie
     * @param score number
     *
     */
    handleRateMovie = async (movie: Movie | null, score: number): Promise<void> => {
        if (movie) {
            this.unsetRateMovie();
            await this.props.onRate(movie, score);
        }
    };

    /**
     * Handles movie deletion
     *
     * @param movie Movie
     */
    handleDeleteMovie = async (movie: Movie | null): Promise<void> => {
        if (movie) {
            this.setState({deleteMovie: null});
            await this.props.onDelete(movie);
        }
    }

    /**
     * @return JSX.Element
     */
    render(): JSX.Element {
        const {deleteMovie, rateMovie, rateButton}: MoviesTableState = this.state;
        const {movies, onSort, sort, selectedMovie}: MoviesTableProps = this.props;

        return (
            <React.Fragment>
                <Modal show={!!deleteMovie}
                       onHide={() => this.setDeleteMovie(null)}
                       backdrop="static"
                       keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>Warning</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Are you sure you want to delete this record?.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setDeleteMovie(null)}>No</Button>
                        <Button variant="primary" onClick={() => this.handleDeleteMovie(deleteMovie)}>Yes</Button>
                    </Modal.Footer>
                </Modal>

                {
                    rateMovie && rateButton ?
                        <Overlay target={rateButton} show={true} rootClose={true} placement="left"
                                 onHide={this.unsetRateMovie}>
                            <Popover id="popover-basic">
                                <Popover.Content style={{fontSize: '2em'}} className="pt-0 pl-2 pb-0 pr-2 d-flex">
                                    <StarRating rating={rateMovie.myVote || 0}
                                                onChange={(rating: number) => this.handleRateMovie(rateMovie, rating)}/>
                                </Popover.Content>
                            </Popover>
                        </Overlay>
                        : null
                }


                <Table
                    records={movies}
                    columns={this.columns}
                    onSort={onSort}
                    sort={sort}
                    selectedRecord={selectedMovie}
                />
            </React.Fragment>
        );
    }
}

export default MoviesTable;
