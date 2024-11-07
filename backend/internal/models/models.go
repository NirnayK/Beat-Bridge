package models

type Song struct {
    ID       string `db:"id" json:"id"`
    Title    string `db:"title" json:"title"`
    Artist   string `db:"artist" json:"artist"`
    Duration int    `db:"duration" json:"duration"`
}
